import * as admin from "firebase-admin";
import { ApolloError } from "apollo-server-cloud-functions";
import { IPod, TUserId, TPodId, IUser } from "@instapods/firestore-types";
import * as uuid from "uuid";
import { _resolver_list_of_admins_and_members } from "../user";
import {
  AccessStage,
  InitalInteractionCountObject,
  FIRESTORE_PODS_COLLECTION,
  FIRESTORE_USERS_COLLECTION,
  BASE_KARMA
} from "../../../../../constants";
import {
  subscribeToPodTopic,
  unsubscribeFromPodTopic
} from "../../../../../api/cloud-messaging.api";
import { extractDropImage } from "../drop";

export const listMyPods = async (
  _: any,
  args: {},
  context: any,
  info: any
): Promise<any> => {
  const { idToken, firestore } = context;
  const verifiedUserId: TUserId = (await admin.auth().verifyIdToken(idToken))
    .uid;
  // grab a simple list of a users pods
  const snapshot = await firestore
    .collection(FIRESTORE_PODS_COLLECTION)
    .where("members", "array-contains", verifiedUserId)
    .get();
  const pods: Array<IPod> = [];
  snapshot.forEach((doc: any) => {
    pods.push(doc.data());
  });
  return pods.map((pod: IPod) => ({
    id: pod.id,
    name: pod.name,
    slug: pod.slug,
    karma: pod.karma,
    members: pod.members,
    publicDescription: pod.publicDescription,
    image: extractDropImage(pod.image),
    hashtags: pod.hashtags,
    recentDrops: pod.recentDrops,
    isPublic: pod.isPublic
  }));
};

export const getPodDetailsAsInvitee = async (
  _: any,
  args: {
    podId: TPodId;
  },
  context: any,
  info: any
) => {
  const { podId } = args;
  const { firestore } = context;
  const doc = await firestore
    .collection(FIRESTORE_PODS_COLLECTION)
    .doc(podId)
    .get();
  const pod: IPod = doc.data();
  // grab the pod admins and members
  const [...members] = await _resolver_list_of_admins_and_members(
    firestore,
    pod.admins,
    pod.members
  );
  // return the private pod details
  return {
    id: pod.id,
    name: pod.name,
    slug: pod.slug,
    membersCount: members.length,
    karma: pod.karma,
    publicDescription: pod.publicDescription,
    image: extractDropImage(pod.image),
    hashtags: pod.hashtags,
    isPublic: pod.isPublic
  };
};

export const getPodDetailsAsMember = async (
  _: any,
  args: {
    podId: TPodId;
  },
  context: any,
  info: any
) => {
  const { podId } = args;
  const { idToken, firestore } = context;
  const verifiedUserId: TUserId = (await admin.auth().verifyIdToken(idToken))
    .uid;
  const doc = await firestore
    .collection(FIRESTORE_PODS_COLLECTION)
    .doc(podId)
    .get();
  const pod: IPod = doc.data();
  // check if user is even a member of this pod
  if (!pod.members.includes(verifiedUserId)) {
    return new ApolloError(
      "You do not have permission to view the details of this Pod"
    );
  }
  // grab the pod admins and members
  const [admins, members] = await _resolver_list_of_admins_and_members(
    firestore,
    pod.admins,
    pod.members
  );
  // return the private pod details
  return {
    id: pod.id,
    name: pod.name,
    slug: pod.slug,
    karma: pod.karma,
    publicDescription: pod.publicDescription,
    privateDescription: pod.privateDescription,
    image: extractDropImage(pod.image),
    hashtags: pod.hashtags,
    admins,
    members,
    recentDrops: pod.recentDrops.map(drop => ({
      ...drop,
      image: extractDropImage(drop.image)
    })),
    isPublic: pod.isPublic
  };
};

export const getPodDetailsAsAdmin = async (
  _: any,
  args: {
    podId: TPodId;
  },
  context: any,
  info: any
) => {
  const { podId } = args;
  const { idToken, firestore } = context;
  const verifiedUserId: TUserId = (await admin.auth().verifyIdToken(idToken))
    .uid;
  const doc = await firestore
    .collection(FIRESTORE_PODS_COLLECTION)
    .doc(podId)
    .get();
  const pod: IPod = doc.data();
  // check that the user has permission to view the pod admin details
  if (!pod.admins.includes(verifiedUserId)) {
    return new ApolloError(
      "You do not have permission to view the details of this Pod"
    );
  }
  // grab the pod admins and members
  const [admins, members] = await _resolver_list_of_admins_and_members(
    firestore,
    pod.admins,
    pod.members
  );
  // return the pod admin details
  return {
    id: pod.id,
    name: pod.name,
    slug: pod.slug,
    publicDescription: pod.publicDescription,
    privateDescription: pod.privateDescription,
    image: extractDropImage(pod.image),
    hashtags: pod.hashtags,
    admins,
    members,
    recentDrops: pod.recentDrops.map(drop => ({
      ...drop,
      image: extractDropImage(drop.image)
    })),
    isPublic: pod.isPublic,
    karma: pod.karma
  };
};

export const createPod = async (
  _: any,
  args: {
    name: string;
    slug: string;
    desc: string;
    hashtags: Array<string>;
  },
  context: any,
  info: any
) => {
  const { name, slug, desc, hashtags } = args;
  const { idToken, firestore } = context;
  const verifiedUserId: TUserId = (await admin.auth().verifyIdToken(idToken))
    .uid;
  const userDoc = await firestore
    .collection(FIRESTORE_USERS_COLLECTION)
    .doc(verifiedUserId)
    .get();
  const user: IUser = userDoc.data();
  // create the pod
  const podId: TPodId = uuid.v4();
  const newPod: IPod = {
    id: podId,
    name,
    slug,
    publicDescription: desc,
    privateDescription: desc,
    image: [],
    hashtags,
    admins: [verifiedUserId],
    members: [verifiedUserId],
    recentDrops: [],
    isPublic: false,
    karma: BASE_KARMA, // initialize karma
    totalInteractionCounts: InitalInteractionCountObject,
    bts: {
      accessStage: AccessStage.ALPHA,
      createdAt: new Date(),
      notes: ""
    }
  };
  await firestore.doc(`${FIRESTORE_PODS_COLLECTION}/${podId}`).set(newPod);
  await subscribeToPodTopic({ topic: podId, fcmToken: user.bts.fcmToken });
  return podId;
};

export const joinPod = async (
  _: any,
  args: {
    podId: TPodId;
  },
  context: any,
  info: any
) => {
  const { podId } = args;
  const { idToken, firestore } = context;
  const verifiedUserId: TUserId = (await admin.auth().verifyIdToken(idToken))
    .uid;
  // execute the joining of pod
  await firestore
    .collection(FIRESTORE_PODS_COLLECTION)
    .doc(podId)
    .update({
      members: admin.firestore.FieldValue.arrayUnion(verifiedUserId)
    });
  const [userDoc] = await Promise.all([
    await firestore
      .collection(FIRESTORE_USERS_COLLECTION)
      .doc(verifiedUserId)
      .get()
  ]);
  const user: IUser = userDoc.data();
  await subscribeToPodTopic({ topic: podId, fcmToken: user.bts.fcmToken });
  return podId;
};

export const leavePod = async (
  _: any,
  args: {
    podId: TPodId;
  },
  context: any,
  info: any
) => {
  const { podId } = args;
  console.log(`leavePod id: ${podId}`);
  const { idToken, firestore } = context;
  const verifiedUserId: TUserId = (await admin.auth().verifyIdToken(idToken))
    .uid;
  const [userDoc] = await Promise.all([
    await firestore
      .collection(FIRESTORE_USERS_COLLECTION)
      .doc(verifiedUserId)
      .get()
  ]);
  const user: IUser = userDoc.data();
  console.log(`leavePod user: `, user);
  // execute leaving the pod
  await firestore
    .collection(FIRESTORE_PODS_COLLECTION)
    .doc(podId)
    .update({
      members: admin.firestore.FieldValue.arrayRemove(verifiedUserId)
    });
  await unsubscribeFromPodTopic({
    topic: podId,
    fcmToken: user.bts.fcmToken
  });
  console.log("leavePod done");
  return podId;
};

/**
 * removes a list of user ids from pod members and admins
 * @param _
 * @param args
 * @param context
 * @param info
 */
export const kickPodMembers = async (
  _: any,
  args: {
    podId: TPodId;
    offenderIds: Array<TUserId>;
  },
  context: any,
  info: any
) => {
  const { offenderIds, podId } = args;
  const { idToken, firestore } = context;
  const verifiedUserId: TUserId = (await admin.auth().verifyIdToken(idToken))
    .uid;
  // check if the user has permission to do this
  const [podDoc, userDoc] = await Promise.all([
    await firestore
      .collection(FIRESTORE_PODS_COLLECTION)
      .doc(podId)
      .get(),
    await firestore
      .collection(FIRESTORE_USERS_COLLECTION)
      .doc(verifiedUserId)
      .get()
  ]);
  const pod: IPod = podDoc.data();
  const user: IUser = userDoc.data();
  console.log(user);
  if (!pod.admins.includes(verifiedUserId)) {
    return new ApolloError(
      "You do not have permission to kick out a user from this Pod"
    );
  }
  // execute the PodMember kick out
  await Promise.all([
    await firestore
      .collection(FIRESTORE_PODS_COLLECTION)
      .doc(podId)
      .update({
        members: admin.firestore.FieldValue.arrayRemove(...offenderIds),
        admins: admin.firestore.FieldValue.arrayRemove(...offenderIds)
      }),
    await unsubscribeFromPodTopic({
      topic: podId,
      fcmToken: user.bts.fcmToken
    })
  ]);
  return offenderIds;
};

/**
 * adds all users in @param args.userIds to admin list in a pod
 * @param _
 * @param args Array<TUserId> | TUserId: an array of user Ids to promote
 * @param context
 * @param info
 */
export const promotePodMembers = async (
  _: any,
  args: {
    podId: TPodId;
    userIds: Array<TUserId> | TUserId;
  },
  context: any,
  info: any
) => {
  const { userIds, podId } = args;
  const { idToken, firestore } = context;
  const verifiedUserId: TUserId = (await admin.auth().verifyIdToken(idToken))
    .uid;
  // check if the user has permission to do this
  const [podDoc, userDoc] = await Promise.all([
    await firestore
      .collection(FIRESTORE_PODS_COLLECTION)
      .doc(podId)
      .get(),
    await firestore
      .collection(FIRESTORE_USERS_COLLECTION)
      .doc(verifiedUserId)
      .get()
  ]);
  const pod: IPod = podDoc.data();
  const user: IUser = userDoc.data();
  console.log(user);
  if (!pod.admins.includes(verifiedUserId)) {
    return new ApolloError("You do not have permission to promote this user");
  }
  // execute the PodMember kick out
  await Promise.all([
    await firestore
      .collection(FIRESTORE_PODS_COLLECTION)
      .doc(podId)
      .update({
        admins: admin.firestore.FieldValue.arrayUnion(...userIds)
      }),
    await unsubscribeFromPodTopic({
      topic: podId,
      fcmToken: user.bts.fcmToken
    })
  ]);
  return userIds;
};

export const demotePodMembers = async (
  _: any,
  args: {
    podId: TPodId;
    userIds: Array<TUserId> | TUserId;
  },
  context: any,
  info: any
) => {
  const { userIds, podId } = args;
  const { idToken, firestore } = context;
  const verifiedUserId: TUserId = (await admin.auth().verifyIdToken(idToken))
    .uid;
  // check if the user has permission to do this
  const [podDoc, userDoc] = await Promise.all([
    await firestore
      .collection(FIRESTORE_PODS_COLLECTION)
      .doc(podId)
      .get(),
    await firestore
      .collection(FIRESTORE_USERS_COLLECTION)
      .doc(verifiedUserId)
      .get()
  ]);
  const pod: IPod = podDoc.data();
  const user: IUser = userDoc.data();
  console.log(user);
  if (!pod.admins.includes(verifiedUserId)) {
    return new ApolloError("You do not have permission to promote this user");
  }
  // execute the PodMember kick out
  await Promise.all([
    await firestore
      .collection(FIRESTORE_PODS_COLLECTION)
      .doc(podId)
      .update({
        admins: admin.firestore.FieldValue.arrayRemove(...userIds)
      }),
    await unsubscribeFromPodTopic({
      topic: podId,
      fcmToken: user.bts.fcmToken
    })
  ]);
  return userIds;
};

export const discoverPublicPod = async (
  _: any,
  args: {
    slug: string;
  },
  context: any,
  info: any
) => {
  const { slug } = args;
  const { firestore } = context;
  const snapshot = await firestore
    .collection(FIRESTORE_PODS_COLLECTION)
    .where("slug", "==", slug)
    .get();
  const pods: Array<IPod> = [];
  snapshot.forEach((doc: any) => {
    pods.push(doc.data());
  });
  const pod = pods[0];
  if (!pod) {
    return new ApolloError("No such pod exists by this name");
  }
  // return the pod admin details
  return {
    id: pod.id,
    name: pod.name,
    slug: pod.slug,
    publicDescription: pod.publicDescription,
    image: extractDropImage(pod.image),
    membersCount: pod.members.length,
    recentDropsCount: pod.recentDrops.length,
    isPublic: pod.isPublic,
    // podKarma: 100,
    karma: pod.karma
  };
};

export const updatePodPrivateDescription = async (
  _: any,
  args: {
    podId: string;
    privateDescription: string;
  },
  context: any,
  info: any
) => {
  const { podId, privateDescription } = args;
  const { idToken, firestore } = context;
  const verifiedUserId: TUserId = (await admin.auth().verifyIdToken(idToken))
    .uid;
  const podRef = await firestore
    .collection(FIRESTORE_PODS_COLLECTION)
    .doc(podId);
  let admins: Array<TUserId> = [];
  await podRef.get().then((doc: any) => {
    const data = doc.data();
    admins = data.admins;
  });
  if (admins.indexOf(verifiedUserId) === -1) {
    return new ApolloError("You are not a pod admin!");
  }
  // await podRef.set({ privateDescription }, { merge: true });
  await podRef.update({ privateDescription });

  return podId;
};
