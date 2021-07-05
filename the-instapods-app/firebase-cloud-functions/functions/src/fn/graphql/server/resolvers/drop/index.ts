import * as admin from "firebase-admin";
import { ApolloError } from "apollo-server-cloud-functions";
import { sample as _sample } from "lodash";
import {
  IDrop,
  IUser,
  TUserId,
  TPodId,
  TDropId,
  IPod,
  TImageSourceProp,
  IDropSnapshotAugmented,
  IDrop_Fragment
} from "@instapods/firestore-types";
import * as uuid from "uuid";
import {
  crawlDropSnapshot,
  extractHashtags,
  stripShareId
} from "../../../../../api/apify.api";
import { sendPushNotificationsToPodTopic } from "../../../../../api/cloud-messaging.api";
import { saveImageToCloudStorage } from "../../../../../api/cloud-storage.api";
import { extractProfileImage } from "../user/index";
import {
  AccessStage,
  DropStatus,
  FIRESTORE_DROPS_COLLECTION,
  FIRESTORE_USERS_COLLECTION,
  FIRESTORE_PODS_COLLECTION,
  FIRESTORE_POD_DROP_SUBCOLLECTION
} from "../../../../../constants";

export const extractDropImage = (
  images: Array<TImageSourceProp>
): Array<TImageSourceProp> => {
  if (images && images.length > 0) {
    return images;
  }
  return [
    {
      height: 256,
      width: 256,
      uri:
        _sample([
          "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2F89970370_688870705188388_6967325892186897070_n.jpg?alt=media&token=146b8297-fb22-4f2c-8f8e-8666704a08ca",
          "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2F81683868_215393036309469_2260618459203003649_n.jpg?alt=media&token=56fe3129-a3ae-4fde-8807-fa758e245ba5",
          "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2F88926967_584797335440182_4685446952357403788_n.jpg?alt=media&token=bbd01b1e-a62e-426b-ac3b-d2ba16b5a9d2",
          "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2F88339074_210014253401199_3192151212187754107_n.jpg?alt=media&token=d5fc592c-3659-4df0-964f-c3ab28909172",
          "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2F88137312_183441799629608_7271864832310919999_n.jpg?alt=media&token=0a9a3eba-a80e-4b43-adeb-1d1452de053c",
          "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2F87894144_237162050644803_3763872575534842527_n.jpg?alt=media&token=bfc55d66-66aa-4622-9cce-67cc0683c2bb",
          "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2F87699301_812496565913926_7096544317628222732_n.jpg?alt=media&token=b7a3fcc0-1e84-4b16-9431-34247f8b146f",
          "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2F87378910_208111660570016_958118036376996003_n.jpg?alt=media&token=b4e3b910-c6d0-4b5b-aec6-5389f577aa42",
          "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2F87228889_215330819590225_409957962366303006_n.jpg?alt=media&token=4be73e9d-8ded-490f-8a50-ee18fb48352c",
          "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2F85184468_660625541377844_5808603222677916727_n.jpg?alt=media&token=117f68e5-65b5-4a0c-aa03-0d320a7bae19",
          "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2F85051428_2834161200008279_686237427652288986_n.jpg?alt=media&token=0c57c47e-282f-4210-a2cd-17f0ceb81d17",
          "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2F85012734_234191320920876_1544548141311792142_n.jpg?alt=media&token=0d510d0b-fc26-4f43-b541-ee4c8edd213b",
          "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2F84855263_130960964895328_8917580183465201244_n.jpg?alt=media&token=91d4c461-9ed5-48ea-ac7e-9cb8f74dc558",
          "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2F84337964_223979232069372_5253869767618774693_n.jpg?alt=media&token=1783dd9b-22bb-4af7-b547-ae0afba1802a",
          "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2F84335525_188095965847131_6608034978543116022_n.jpg?alt=media&token=d570bfad-947a-4ba7-b01f-14f5d7318deb",
          "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2F84177936_2225571144419037_3502717202733597615_n.jpg?alt=media&token=0f5a2e6a-f89a-48ed-b37f-c90e19b8b1dc",
          "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2F84083049_167771728006081_5494862450888034568_n.jpg?alt=media&token=07c0b9ab-3043-47fb-9bce-5a65f9c1f292",
          "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2F83856576_2596800543921769_1892892154239889764_n.jpg?alt=media&token=f9922a40-919f-4d20-8335-3e8070a477fb",
          "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2F83640953_1435969006576792_4104533302009686287_n.jpg?alt=media&token=17048f6e-8d62-4ef5-a53c-74462ac2581c",
          "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2F82472241_191740845405347_7359754789648581873_n.jpg?alt=media&token=4a5fca58-947a-4fd4-a898-5e95c5f477a9"
        ]) ||
        "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2Fplaceholder_drop_image_1-min.jpeg?alt=media&token=d25b3e52-9966-4239-be6b-3ecb4474f120"
    }
  ];
};

export const viewMyDropResults = async (
  _: any,
  args: {
    dropId: TDropId;
  },
  context: any,
  info: any
) => {
  const { dropId } = args;
  const { idToken, firestore } = context;
  const verifiedUserId: TUserId = (await admin.auth().verifyIdToken(idToken))
    .uid;
  const a = await firestore
    .collection(FIRESTORE_DROPS_COLLECTION)
    .doc(dropId)
    .get();
  const b: IDrop = a.data();
  if (b.userId !== verifiedUserId) {
    return new ApolloError(
      "You do not have permission to view the results of this Drop"
    );
  }
  const doc = await firestore
    .collection(FIRESTORE_DROPS_COLLECTION)
    .doc(dropId)
    .get();
  const drop: IDrop = doc.data();
  const dropResults = {
    id: drop.id,
    userId: drop.userId,
    username: drop.username,
    contentUrl: drop.contentUrl,
    image: extractDropImage(drop.image),
    droppedDate: drop.droppedDate,
    title: drop.title,
    desc: drop.desc,
    scheduledDate: drop.scheduledDate,
    isPublic: drop.isPublic,
    pods: drop.pods,
    engagements: drop.engagements,
    status: drop.status,
    hashtags: drop.hashtags
  };
  return dropResults;
};

export const viewDropPreEngagement = async (
  _: any,
  args: {
    dropId: TDropId;
  },
  context: any,
  info: any
) => {
  const { dropId } = args;
  const { firestore } = context;
  const doc = await firestore
    .collection(FIRESTORE_DROPS_COLLECTION)
    .doc(dropId)
    .get();
  // we also want the user's karma and image
  const drop: IDrop = doc.data();
  const userId = drop.userId;
  const userDoc = await firestore
    .collection(FIRESTORE_USERS_COLLECTION)
    .doc(userId)
    .get();
  const user: IUser = userDoc.data();
  const dropPreEngagement = {
    id: drop.id,
    username: drop.username,
    contentUrl: drop.contentUrl,
    image: extractDropImage(drop.image),
    title: drop.title,
    desc: drop.desc,
    isPublic: drop.isPublic,
    userId: userId,
    userImage: extractProfileImage(user.image),
    userKarma: user.karma,
    droppedDate: drop.droppedDate
  };
  return dropPreEngagement;
};

export const createDrop = async (
  _: any,
  args: {
    contentUrl: string;
    title: string;
    desc: string;
    scheduledDate: Date;
    podIds: Array<TPodId>;
  },
  context: any,
  info: any
) => {
  const { idToken, firestore } = context;
  const verifiedUserId: TUserId = (await admin.auth().verifyIdToken(idToken))
    .uid;
  const {
    contentUrl,
    title,
    desc = "",
    scheduledDate = new Date(),
    podIds
  } = args;
  const dropId: TDropId = uuid.v4();
  const [userDoc, dropsSnap] = await Promise.all([
    await firestore
      .collection(FIRESTORE_USERS_COLLECTION)
      .doc(verifiedUserId)
      .get(),
    await firestore
      .collection(FIRESTORE_DROPS_COLLECTION)
      .where("contentUrl", "==", stripShareId(contentUrl))
      .get()
  ]);
  const me: IUser = userDoc.data();
  const { username } = me;
  const drops: Array<IPod> = [];
  dropsSnap.forEach((doc: any) => {
    drops.push(doc.data());
  });
  if (drops && drops.length > 0) {
    return new ApolloError("You cannot drop the same post twice");
  }
  const newDrop: IDrop = {
    id: dropId,
    userId: verifiedUserId,
    username,
    contentUrl: stripShareId(contentUrl),
    image: [],
    title,
    desc,
    scheduledDate,
    droppedDate: new Date("Jan 1 2099"),
    isPublic: false,
    pods: podIds,
    engagements: [],
    hashtags: [],
    status: DropStatus.PENDING,
    bts: {
      accessStage: AccessStage.ALPHA,
      btsNotes: ""
    },
    crawlSchedule: {
      onRelease: false,
      [10]: false,
      isCleared: false,
      isInPod: true,
      isCrawling: false
    }
  };
  await firestore.doc(`${FIRESTORE_DROPS_COLLECTION}/${dropId}`).set(newDrop);
  return dropId;
};

export const releaseDrop = async (
  _: any,
  args: {
    dropId: TDropId;
  },
  context: any,
  info: any
) => {
  console.log("------ releaseDrop ------");
  const { dropId } = args;
  const { idToken, firestore } = context;
  const verifiedUserId: TUserId = (await admin.auth().verifyIdToken(idToken))
    .uid;
  const [docDrop, docUser] = await Promise.all([
    await firestore
      .collection(FIRESTORE_DROPS_COLLECTION)
      .doc(dropId)
      .get(),
    await firestore
      .collection(FIRESTORE_USERS_COLLECTION)
      .doc(verifiedUserId)
      .get()
  ]);
  const drop: IDrop = docDrop.data();
  const user: IUser = docUser.data();
  if (drop.userId !== verifiedUserId) {
    return new ApolloError("You do not have permission to release this Drop");
  }
  // crawl drop using firebase scheduler
  const crawlSnapshot: IDropSnapshotAugmented = await crawlDropSnapshot(
    drop.contentUrl
  );
  if (crawlSnapshot.ownerUsername !== user.username) {
    await firestore
      .collection(FIRESTORE_DROPS_COLLECTION)
      .doc(dropId)
      .delete();
    return new ApolloError("You are not the owner of this post");
  }
  const droppedDate = new Date();
  const firebaseImageBackup = await saveImageToCloudStorage(
    crawlSnapshot.displayUrl,
    `${FIRESTORE_USERS_COLLECTION}/${verifiedUserId}/${FIRESTORE_DROPS_COLLECTION}/${dropId}`,
    `${dropId}_content_pic_${droppedDate.getTime() / 1000}.png`
  );
  const snapshotImage = [
    {
      uri: firebaseImageBackup,
      height: crawlSnapshot.dimensionsHeight,
      width: crawlSnapshot.dimensionsWidth
    }
  ];
  await Promise.all([
    // update the drop
    await firestore
      .collection(FIRESTORE_DROPS_COLLECTION)
      .doc(dropId)
      .update({
        status: DropStatus.RELEASED,
        droppedDate,
        snapshot: crawlSnapshot,
        hashtags: extractHashtags(crawlSnapshot.caption),
        desc: crawlSnapshot.caption,
        image: snapshotImage,
        ["crawlSchedule.onRelease"]: true
      }),
    // add the released drop to all associated pods
    ...drop.pods.map(async podId => {
      const appendDropFrag: IDrop_Fragment = {
        id: drop.id,
        userId: drop.userId,
        username: drop.username,
        contentUrl: drop.contentUrl,
        image: snapshotImage,
        title: drop.title,
        desc: crawlSnapshot.caption,
        scheduledDate: drop.scheduledDate,
        droppedDate
      };
      const podSnapShot = await firestore
        .collection(FIRESTORE_PODS_COLLECTION)
        .doc(podId);
      return Promise.all([
        await podSnapShot.update({
          desc: crawlSnapshot.caption,
          image: snapshotImage,
          recentDrops: admin.firestore.FieldValue.arrayUnion(appendDropFrag)
        }),
        await podSnapShot
          .collection(FIRESTORE_POD_DROP_SUBCOLLECTION)
          .doc(dropId)
          .set(appendDropFrag)
      ]);
    })
  ]);
  await Promise.all(
    drop.pods.map(async (id: TPodId) => {
      return await sendPushNotificationsToPodTopic({
        topic: id,
        drop
      });
    })
  );
  return dropId;
};

export const _Drop_pods = async (
  _source: any,
  args: any,
  context: any,
  info: any
) => {
  const { pods: dropPods } = _source;
  const { firestore } = context;
  const snapshot = await firestore
    .collection(FIRESTORE_PODS_COLLECTION)
    .where("id", "in", dropPods)
    .get();
  const pods: Array<IPod> = [];
  snapshot.forEach((doc: any) => {
    pods.push(doc.data());
  });
  return pods.map(pod => ({
    id: pod.id,
    name: pod.name,
    slug: pod.slug,
    karma: pod.karma,
    publicDescription: pod.publicDescription,
    image: pod.image,
    hashtags: pod.hashtags,
    recentDrops: pod.recentDrops,
    isPublic: pod.isPublic
  }));
};

export const DropResultsResolver = {
  pods: _Drop_pods
};
