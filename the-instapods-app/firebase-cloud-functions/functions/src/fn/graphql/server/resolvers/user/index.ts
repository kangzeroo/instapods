import {
  TUserId,
  IUser,
  IDrop,
  TImageSourceProp,
  IPublicUser,
  IUserProfile,
  IUserAccountSnapshotsAugmented
} from "@instapods/firestore-types";
import { ApolloError } from "apollo-server-cloud-functions";
import { extractDropImage } from "../drop";
import { runVerificationCrawler } from "../../../../../api/apify.api";
import { saveImageToCloudStorage } from "../../../../../api/cloud-storage.api";
import { auth } from "firebase-admin";
import {
  FIRESTORE_DROPS_COLLECTION,
  FIRESTORE_USERS_COLLECTION
  // verificationCode,
} from "../../../../../constants";

export const extractProfileImage = (
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
        "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2Fempty_profile_picture.png?alt=media&token=64361047-5340-4a05-9924-a0ccde68d21c"
    }
  ];
};

export const getUserRelationshipProfile = async (
  _: any,
  args: {
    theirId: TUserId;
  },
  context: any,
  info: any
): Promise<IPublicUser> => {
  const { theirId } = args;
  const { firestore } = context;
  // const verifiedUserId = (await auth().verifyIdToken(idToken)).uid
  const doc = await firestore
    .collection(FIRESTORE_USERS_COLLECTION)
    .doc(theirId)
    .get();
  const user: IUser = doc.data();
  return {
    id: user.id,
    username: user.username,
    image: extractProfileImage(user.image),
    isPublic: user.isPublic,
    isOnline: user.isOnline,
    karma: user.karma
  };
};

export const getMyProfile = async (
  _: any,
  args: {},
  context: any,
  info: any
): Promise<IUserProfile> => {
  const { idToken, firestore } = context;
  console.log("============== getMyProfile ==============");
  console.log(`token: ${idToken}`);
  const verifiedUserId = (await auth().verifyIdToken(idToken)).uid;
  console.log(`id from token: ${verifiedUserId}`);
  const doc = await firestore
    .collection(FIRESTORE_USERS_COLLECTION)
    .doc(verifiedUserId)
    .get();
  const user: IUser = doc.data();
  const { id: userid, username, image, isPublic, isOnline, karma, bts } = user;
  const gqlUser = {
    id: userid,
    username,
    image: extractProfileImage(image),
    isPublic,
    isOnline,
    karma,
    isVerified: bts.isVerified,
    verificationCode: bts.verificationCode,
    onboardingSchedule: bts.onboardingSchedule
  };
  return gqlUser;
};

export const updateMyProfile = async (
  _: any,
  args: {
    username: string;
  },
  context: any,
  info: any
) => {
  const { username } = args;
  const { idToken, firestore } = context;
  const verifiedUserId = (await auth().verifyIdToken(idToken)).uid;
  await firestore
    .collection(FIRESTORE_USERS_COLLECTION)
    .doc(verifiedUserId)
    .update({ username });
  return verifiedUserId;
};

export const _PrivateUser_drops = async (
  _source: any,
  args: any,
  context: any,
  info: any
) => {
  const { id } = _source;
  const { firestore } = context;
  const snapshot = await firestore
    .collection(FIRESTORE_DROPS_COLLECTION)
    .where("userId", "==", id)
    .orderBy("droppedDate", "desc")
    .get();
  const drops: Array<IDrop> = [];
  snapshot.forEach((doc: any) => {
    drops.push(doc.data());
  });
  return drops.map(d => ({
    id: d.id,
    userId: d.userId,
    username: d.username,
    contentUrl: d.contentUrl,
    image: extractDropImage(d.image),
    title: d.title,
    desc: d.desc,
    scheduledDate: d.scheduledDate
  }));
};

export const PrivateUserResolver = {
  drops: _PrivateUser_drops
};

type TUsersList = Array<IPublicUser>;
export const _resolver_list_of_admins_and_members = async (
  firestore: any,
  admins: Array<TUserId>,
  members: Array<TUserId>
): Promise<Array<TUsersList>> => {
  const getUser = async (id: string) => {
    const doc = await firestore
      .collection(FIRESTORE_USERS_COLLECTION)
      .doc(id)
      .get();
    const user: IUser = doc.data();
    return {
      id: user.id,
      username: user.username,
      image: extractProfileImage(user.image),
      isPublic: user.isPublic,
      isOnline: user.isOnline,
      karma: user.karma
    };
  };
  return Promise.all([
    await Promise.all(admins.map(getUser)),
    await Promise.all(members.map(getUser))
  ]);
};

export const verifyAccount = async (
  _: any,
  args: {
    username: string;
  },
  context: any,
  info: any
) => {
  const { username } = args;
  const { idToken, firestore } = context;
  const verifiedUserId = (await auth().verifyIdToken(idToken)).uid;
  console.log("verifyAccount --- ", verifiedUserId);
  const snapshot = await firestore
    .collection(FIRESTORE_USERS_COLLECTION)
    .where("username", "==", username)
    .where("bts.isVerified", "==", true)
    .get();
  const existingUsers: Array<IUser> = [];
  snapshot.forEach((doc: any) => {
    existingUsers.push(doc.data());
  });
  if (existingUsers && existingUsers.length > 0) {
    return new ApolloError("This user has already signed up and been verified");
  }
  try {
    const crawlInfo: IUserAccountSnapshotsAugmented = await runVerificationCrawler(
      username
    );
    // if (crawlInfo.biography.indexOf(verificationCode) === -1) {
    //   return new ApolloError(`Please add #${verificationCode} in your bio.`);
    // }
    if (crawlInfo.private) {
      return new ApolloError(
        "Your account must be public in order to use Instapods."
      );
    }
    const firebaseImageBackup = await saveImageToCloudStorage(
      crawlInfo.profilePicUrl,
      `${FIRESTORE_USERS_COLLECTION}/${verifiedUserId}/profile_pics`,
      `${verifiedUserId}_profile_pic_${new Date().getTime() / 1000}.png`
    );
    await Promise.all([
      await firestore
        .collection(FIRESTORE_USERS_COLLECTION)
        .doc(verifiedUserId)
        .update({
          username,
          image: [
            {
              uri: firebaseImageBackup,
              height: 256,
              width: 256
            }
          ],
          ["bts.isVerified"]: true,
          ["bts.instagramId"]: crawlInfo.id,
          ["bts.followersCount"]: crawlInfo.followersCount,
          ["bts.followsCount"]: crawlInfo.followsCount,
          ["bts.isInstagramVerified"]: crawlInfo.verified,
          ["bts.isPrivateAccount"]: crawlInfo.private,
          ["bts.isBusinessAccount"]: crawlInfo.isBusinessAccount
        }),
      await firestore
        .collection(FIRESTORE_USERS_COLLECTION)
        .doc(verifiedUserId)
        .collection("accountSnapshots")
        .doc(crawlInfo.apifyRunInfo.id)
        .set(crawlInfo)
    ]);
    return verifiedUserId;
  } catch (e) {
    console.log("verifyAccount... ");
    console.log(e);
    return new ApolloError(e);
  }
};

export const updateOnboardingSchedule = async (
  _: any,
  args: {
    onboardingEvent: string;
  },
  context: any,
  info: any
) => {
  const { onboardingEvent } = args;
  const { idToken, firestore } = context;
  const verifiedUserId = (await auth().verifyIdToken(idToken)).uid;
  const doc = await firestore
    .collection(FIRESTORE_USERS_COLLECTION)
    .doc(verifiedUserId)
    .get();
  const user: IUser = doc.data();
  await firestore
    .collection(FIRESTORE_USERS_COLLECTION)
    .doc(verifiedUserId)
    .update({
      bts: {
        ...user.bts,
        onboardingSchedule: {
          ...user.bts.onboardingSchedule,
          [onboardingEvent]: `${user.bts.onboardingSchedule[onboardingEvent] ||
            ""}${new Date()};`
        }
      }
    });
  return user.id;
};

export const updateUserPushNotificationToken = async (
  _: any,
  args: {
    token: string;
  },
  context: any,
  info: any
) => {
  console.log("------- updateUserPushNotificationToken");
  const { token } = args;
  console.log(token);
  const { idToken, firestore } = context;
  const verifiedUserId = (await auth().verifyIdToken(idToken)).uid;
  const doc = await firestore
    .collection(FIRESTORE_USERS_COLLECTION)
    .doc(verifiedUserId)
    .get();
  const user: IUser = doc.data();
  await firestore
    .collection(FIRESTORE_USERS_COLLECTION)
    .doc(verifiedUserId)
    .update({
      bts: {
        ...user.bts,
        fcmToken: token
      }
    });
  return user.id;
};
