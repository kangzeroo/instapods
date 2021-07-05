const functions = require("firebase-functions");
const admin = require("firebase-admin");
const moment = require("moment");
import {
  IPod,
  IUser,
  TKarma,
  TPodId,
  IEngagement,
  IInteractionCount,
  TInteractionType,
  TInteractionCount,
  IDrop_Fragment
} from "@instapods/firestore-types";
import {
  returnInteractionValue,
  InitalInteractionCountObject,
  FIRE_KARMA_MULTIPLIER,
  BASELINE_KARMA_MULTIPLIER,
  BASE_KARMA,
  KARMA_HOUR_LIMIT,
  FIRESTORE_DROPS_COLLECTION,
  FIRESTORE_PODS_COLLECTION,
  FIRESTORE_ENGAGEMENTS_COLLECTION,
  FIRESTORE_USERS_COLLECTION
} from "../../constants";

const firestore = admin.firestore();

/**
 * updates all pod and user karmas pertaining to a single drop, this gets triggered when
 * firestore://drops/["crawlSchedule.10"] is changed to true
 *
 * @note might make sense to make the trigger more generic - it seems like "crawlSchedule.10" could be
 *       subject to change
 */
const onDropCrawlCompleteUpdateKarma = functions.firestore
  .document(`${FIRESTORE_DROPS_COLLECTION}/{DropId}`)
  .onUpdate(async (change: any, context: any) => {
    // Retrieve the current and previous value
    console.log("============ onDropCrawlCompleteUpdateKarma ============");
    const data = change.after.data();
    const previousData = change.before.data();

    // only update if "crawlSchedule.10" is updated to true:
    if (!data["crawlSchedule"]["10"] || previousData["crawlSchedule"]["10"]) {
      console.log("no change");
      // do nothing
      return null;
    }

    const { pods } = data; // this is all the podIds within the drop
    console.log("update karma for pods: ", pods);
    await onDropCrawlCompleteUpdateKarmaLogic(pods);

    return null;
  });

/**
 * updates all pod karmas as well as any users within that pod
 * @param podIds Array of pods ids
 * @note this function is kind of a beast, and could probably use some optimization it needs to:
 *       1) READ all pods to get recentDrops, members and total interactions counts
 *       2) READ all members to get total interaction counts (* might be able to shave this off...)
 *       3) READ all engagements for those members (within a specified time) - this computes user karmas
 *       4) REAL all engagements for the recentDrops - this computes pod karmas
 *       5) WRITE user karmas
 *       6) WRITE pod karmas
 */
const onDropCrawlCompleteUpdateKarmaLogic = async (
  podIds: Array<TPodId>
): Promise<any> => {
  // get a snapshot of all of the pods we want to update
  const podSnapshot = await firestore
    .collection(FIRESTORE_PODS_COLLECTION)
    .where("id", "in", podIds)
    .get();
  const pods: Array<IPod> = [];
  podSnapshot.forEach((doc: any) => {
    pods.push(doc.data());
  });
  console.log("updateKarma - input pods pod ids:", pods);
  // we need all engagements for each user - start with unique user ids:
  const members = pods.map((d: IPod) => d.members).flat();
  // get a unique set:
  const umembers = [...new Set(members)];
  console.log("update karma - users: ", umembers);
  // get all engagements within 24 hours for each member
  const engagementMinTime = new Date(
    moment
      .utc()
      .subtract(KARMA_HOUR_LIMIT, "hours")
      .format("YYYY-MM-DDTHH:mm:ss.SSS")
  );
  const engagementSnapshot = await firestore
    .collection(FIRESTORE_ENGAGEMENTS_COLLECTION)
    .where("engagerId", "in", umembers)
    .where("timestamp", ">=", engagementMinTime)
    .get();
  // create the list of all user engagements
  const engagements: Array<IEngagement> = [];
  engagementSnapshot.forEach((d: any) => {
    engagements.push(d.data());
  });
  console.log("all found engagements: ", engagements);
  // first lets update all the user karmas
  // unfortunately, we need to query each user for base tallies...
  const userSnapshot = await firestore
    .collection(FIRESTORE_USERS_COLLECTION)
    .where("id", "in", umembers)
    .get();
  const users: Array<IUser> = [];
  userSnapshot.forEach((userData: any) => {
    users.push(userData.data());
  });
  console.log("all user data: ", users);
  // now lets make an array of updated user karmas:
  const newUserInteractionCounts: Array<IInteractionCount> = [];
  const userKarmas: Array<TKarma> = users.map((d: IUser) => {
    const { totalInteractionCounts } = d; // these are all the total interaction / engagement counts... needs to also be updated.
    const userEngagements = engagements.filter((f: IEngagement) => {
      return f["engagerId"] === d["id"]; // only look at a certain users engagements
    });
    const newInteractionCounts: IInteractionCount = returnInteractionCounts(
      userEngagements
    );
    newUserInteractionCounts.push(newInteractionCounts); // we need this to be insync with userKarmas etc
    return computeKarma(newInteractionCounts, totalInteractionCounts);
  });
  console.log("user karmas: ", userKarmas);
  const podKarmas: Array<TKarma> = [];
  const podNewInteractions: Array<IInteractionCount> = [];
  await getPodKarma(pods, engagementMinTime).then(
    // getPodKarma returns an array of objects {karma: 100, newInteractionCounts: {ACCEPT: 10 ...}}
    async (podDatas: Array<{ [index: string]: any }>) => {
      podDatas.forEach((podData: { [index: string]: any }) => {
        console.log("adding pod karma!: ", podData);
        podKarmas.push(podData["karma"]);
        podNewInteractions.push(podData["newInteractionCounts"]);
      });
    }
  );
  console.log("pod karmas: ", podKarmas);
  // now just update all user karmas + pod karmas + all interaction counts
  await Promise.all([
    // update user documents
    ...users.map(async (userData: IUser, i: number) => {
      console.log(userData, i);
      const userKarma: TKarma = userKarmas[i];
      const { id } = userData;
      // we should allow for updates even when the karma is the same because it is possible and
      // we would still want to update the interaction counts
      // if (karma === userKarma) {
      //   console.log("user karma is same - not updating");
      //   return;
      // }
      const incrValue = generateFirestoreIncrement(newUserInteractionCounts[i]);
      console.log("user incrementing value: ", incrValue);
      // update the user karma and totalInteractionCounts
      const updateValue: { [index: string]: number } = {
        karma: userKarma,
        ...incrValue
      };
      console.log(
        `updating user karma: ${id} to ${userKarma}\nsetting to: ${updateValue}`
      );
      return await firestore
        .collection(FIRESTORE_USERS_COLLECTION)
        .doc(id)
        .update(updateValue);
    }),
    // update pod documents
    ...pods.map(async (podData: IPod, i: number) => {
      console.log(podData, i);
      const newPodKarma: TKarma = podKarmas[i];
      const { id } = podData;
      // if (karma === newPodKarma) {
      //   // karmas are the same, do nothing
      //   console.log("pod karmas are the same - not updating");
      //   return;
      // }
      // karmas are different, update it!
      // create the new interaction counts
      const incrValue = generateFirestoreIncrement(podNewInteractions[i]);
      console.log("pod incrementing value: ", incrValue);
      const updateValue: { [index: string]: number } = {
        karma: newPodKarma,
        ...incrValue
      };
      console.log(
        `updating pod karma ${id} to ${newPodKarma}\nsetting: ${updateValue}`
      );
      return await firestore
        .collection(FIRESTORE_PODS_COLLECTION)
        .doc(id)
        .update(updateValue);
    })
  ]);
  return null; // not sure what to really return....
};

/**
 * calculates the "newInteractionCounts" given a list of engagments
 * @param engagements Array<IEngagements> array of engagements
 */
const returnInteractionCounts = (
  engagements: Array<IEngagement>
): IInteractionCount => {
  const newInteractionCounts = { ...InitalInteractionCountObject }; // initialize a blank interaction count
  // add to interaction counters for each engagement
  engagements.forEach((d: IEngagement) => {
    const { interactionType } = d;
    if (d.interactionType in newInteractionCounts) {
      newInteractionCounts[interactionType] += 1;
    } else {
      // here the interaction type is undocumented... that might be a problem...
      console.log(`un-documented interactionType: ${interactionType}`);
      newInteractionCounts[interactionType] = 1;
    }
  });
  return newInteractionCounts;
};

/**
 * computes a "karma" of InteractionCounts*InteractionValues -> this then gets scaled (i.e. *50)
 * @param interactions object of "interactionCounts" i.e. {"ACCEPT": 4, "DECLINE": 3} => user accepted 4 times, and declined 3 times
 */
const computeKarmaSum = (interactions: IInteractionCount): TKarma => {
  const interactionValueList = Object.keys(interactions).map(
    (d: TInteractionType): TInteractionCount => {
      return returnInteractionValue(d) * interactions[d]; // multiply the number of interactions with the interaction value
      // for example, if there are 5 "accepts" and accept has a value of 2 => 5*2 = 10
    }
  );
  console.log("interactionValueList: ", interactionValueList);
  return interactionValueList.reduce(
    // create a simple sum to get multiplied
    (a: TInteractionCount, b: TInteractionCount): TKarma => a + b
  );
};

/**
 * get all pod karmas
 * @param podArray Array of IPod interfaces
 * @param engagementMinTime Date - the amount of time we consider for "new" interactions - basically determines the wavelength of the sinusoid karma
 * @returns Array<{karma: number, newInteractionCounts: object}> and array of karma values in order of podArray
 */
const getPodKarma = async (podArray: Array<IPod>, engagementMinTime: Date) => {
  return Promise.all([
    ...podArray.map(async (d: IPod) => {
      // we need to look at all the drops for each pod....
      // this may start to get expensive and may indeed be optimized in the future
      const { recentDrops, totalInteractionCounts } = d;
      if (!recentDrops || recentDrops.length === 0) {
        // no recent drops
        return { karma: d.karma, newInteractionCounts: {} };
      }
      // update karma - we need the pods recent drops + all their users + all user engagements in those drops
      // need to query these - it might get FUCKING EXPENSIVE
      const dropIds = recentDrops.map((drop: IDrop_Fragment) => drop.id);
      // const dropCollectionSnapshot = await firestore
      //   .collection(FIRESTORE_DROPS_COLLECTION)
      //   .where("id", "in", dropIds)
      //   .get();
      // const podDropIds: Array<TDropId> = [];
      // dropCollectionSnapshot.forEach((dc: any) => {
      //   podDropIds.push(dc.data()["id"]);
      // });
      // now we need to query all engagements by dropId
      const dropEngagementSnapshot = await firestore
        .collection(FIRESTORE_ENGAGEMENTS_COLLECTION)
        .where("dropId", "in", dropIds)
        .where("timestamp", ">=", engagementMinTime) // want only those <24 hours
        .get();

      const dropEngagements: Array<IEngagement> = [];
      // get a list of ALL engagements for a single pod (<24 hours)
      dropEngagementSnapshot.forEach((eng: any) => {
        dropEngagements.push(eng.data());
      });
      // now compute the engagement counts:
      const newInteractionCounts: IInteractionCount = returnInteractionCounts(
        dropEngagements
      );
      // now get the FUCKING KARMA
      return {
        karma: computeKarma(newInteractionCounts, totalInteractionCounts),
        newInteractionCounts
      };
    })
  ]);
};

/**
 * compute karma
 * @param newInteractions object: containing counts of various interaction types for NEW interactions (i.e. <24hrs for ex)
 * @param totalInteractions object: same as "newInteractions" but the TOTAL counts
 */
const computeKarma = (
  newInteractions: IInteractionCount,
  totalInteractions: IInteractionCount
) => {
  console.log("computing karma... ", newInteractions, totalInteractions);
  const newInteractionValues: TKarma = computeKarmaSum(newInteractions);
  const baselineInteractionValues: TKarma = computeKarmaSum(totalInteractions);
  console.log("computed: ", newInteractionValues, baselineInteractionValues);
  // note: the karma has 2 growth rates: 1) a steady linear rate fn(TOTAL_INTERATIONCTIONS) and more "sinusoidal" like
  // but highly spurratic rate which is dependent on RECENT_INTERACTIONS.
  // here, the "newInteractionValues" correspond to the sinusoid and get multiplied by a "FIRE_KARMA_MULTIPLIER"
  // to add some fire
  return (
    FIRE_KARMA_MULTIPLIER * newInteractionValues +
    BASELINE_KARMA_MULTIPLIER * baselineInteractionValues +
    BASE_KARMA
  );
};

/**
 * this function formats an object to use firebases incrent in a nested object
 * @param newInteractionCounts object of interaction counts
 */
const generateFirestoreIncrement = (
  newInteractionCounts: IInteractionCount
) => {
  const output: { [index: string]: string } = {};
  Object.keys(newInteractionCounts).forEach((intKey: TInteractionType) => {
    output[
      `totalInteractionCounts.${intKey}`
    ] = admin.firestore.FieldValue.increment(newInteractionCounts[intKey]);
  });
  return output;
};

export default onDropCrawlCompleteUpdateKarma;
