const functions = require("firebase-functions");
const admin = require("firebase-admin");
const moment = require("moment");
const _ = require("lodash");
const firestore = admin.firestore();
import { IDrop, IPod, TPodId, TDropId } from "@instapods/firestore-types";
import {
  EVERY_DAY,
  FIRESTORE_DROPS_COLLECTION,
  FIRESTORE_PODS_COLLECTION
} from "../../constants";

// @ts-ignore
// type DataSnapshot = firebase.database.DataSnapshot

/**
 * @ignore
 */

const scheduleRecentDropCleaner = functions.pubsub
  .schedule(EVERY_DAY)
  .timeZone("Etc/UTC")
  .onRun(async (context: any) => {
    await scheduleRecentDropCleanerLogic();
    return null;
  });

/**
 * Write the logic here so that TypeDoc documents it
 *
 * @category ___CATEGORY___
 */
const scheduleRecentDropCleanerLogic = async (): Promise<Array<TDropId>> => {
  console.log("======== scheduleRecentDropCleanerLogic ========");
  // lets clear recent drops from 1 week ago
  const afterTimestamp = new Date(
    moment
      .utc()
      .subtract(14, "days")
      .format("YYYY-MM-DDTHH:mm:ss.SSS")
  );
  const beforeTimestamp = new Date(
    moment
      .utc()
      .subtract(12, "days") // change this from seconds to (60 * 24 - 2, "minutes")
      .format("YYYY-MM-DDTHH:mm:ss.SSS")
  );
  // first get all the drops that are approaching 2 weeks since release
  // and set all of their crawlSchedule.isCleared = true
  const dropsSnapshot = await firestore
    .collection(FIRESTORE_DROPS_COLLECTION)
    .where("droppedDate", ">=", afterTimestamp)
    .where("droppedDate", "<=", beforeTimestamp)
    .where("crawlSchedule.isInPod", "==", true)
    .get();
  const drops: Array<IDrop> = [];
  dropsSnapshot.forEach((doc: any) => {
    drops.push(doc.data());
  });
  // then find all pods where the recent drop exists inside
  const allPods: Array<string> = [];
  drops.forEach(d => {
    d.pods.forEach(p => allPods.push(p));
  });
  const uniquePods = _.uniqBy(allPods, (p: string) => p);
  const pods: Array<IPod> = await Promise.all(
    uniquePods.map(async (podId: TPodId) => {
      const doc = await firestore
        .collection(FIRESTORE_PODS_COLLECTION)
        .doc(podId)
        .get();
      return doc.data();
    })
  );
  const dropIds = drops.map(d => d.id);
  // update those pods with a trimmed list of recentDrops
  const updatedPods = pods.map(pod => ({
    ...pod,
    recentDrops: pod.recentDrops.filter(d => dropIds.indexOf(d.id) >= 0)
  }));
  await Promise.all([
    ...drops.map(async d => {
      return await firestore
        .collection(FIRESTORE_DROPS_COLLECTION)
        .doc(d.id)
        .update({
          ["crawlSchedule.isInPod"]: false
        });
    }),
    ...updatedPods.map(async pod => {
      return await firestore
        .collection(FIRESTORE_PODS_COLLECTION)
        .doc(pod.id)
        .update({
          recentDrops: pod.recentDrops
        });
    })
  ]);
  return dropIds;
};

export default scheduleRecentDropCleaner;
