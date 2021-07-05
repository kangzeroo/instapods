import { IUser } from "@instapods/firestore-types";
const functions = require("firebase-functions");
const admin = require("firebase-admin");
import {
  AccessStage,
  InitalInteractionCountObject,
  BASE_KARMA,
  FIRESTORE_USERS_COLLECTION,
  verificationCode
} from "../../constants";
const firestore = admin.firestore();

// @ts-ignore
// type DataSnapshot = firebase.database.DataSnapshot

/**
 * Write the logic here so that TypeDoc documents it
 *
 * @category Authentication
 */

const createFirebaseUserRecord = async (user: any, context: any) => {
  console.log(user);
  const userRef = firestore.doc(`${FIRESTORE_USERS_COLLECTION}/${user.uid}`);
  const timestamp = new Date();
  const userData: IUser = {
    id: user.uid,
    username: "",
    image: [],
    email: user.email || "",
    isPublic: false,
    isOnline: false,
    karma: BASE_KARMA, // new karma is a simple number!
    totalInteractionCounts: InitalInteractionCountObject,
    bts: {
      accessStage: AccessStage.ALPHA,
      createdAt: timestamp,
      lastOnline: timestamp,
      notes: "",
      verificationCode: verificationCode,
      isVerified: false,
      instagramId: "",
      followersCount: 0,
      followsCount: 0,
      isInstagramVerified: false,
      isPrivateAccount: false,
      isBusinessAccount: false,
      onboardingSchedule: {},
      fcmToken: ""
    },
    accountSnapshots: []
  };
  await userRef.set(userData);
  return user.uid;
};

/**
 * @ignore
 */
const onAuthCreateRecord = functions.auth
  .user()
  .onCreate(createFirebaseUserRecord);

export default onAuthCreateRecord;
