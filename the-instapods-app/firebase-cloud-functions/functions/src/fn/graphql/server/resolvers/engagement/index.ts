import * as uuid from "uuid";
import * as admin from "firebase-admin";
import {
  IEngagement,
  TUserId,
  TInteractionType,
  TEngagementId,
  TDropId
} from "@instapods/firestore-types";
import {
  FIRESTORE_DROPS_COLLECTION,
  FIRESTORE_ENGAGEMENTS_COLLECTION
} from "../../../../../constants";

export const engageDrop = async (
  _: any,
  args: {
    dropId: TDropId;
    dropperId: TUserId;
    engagerUsername: string;
    interactionType: TInteractionType;
    contents: string;
  },
  context: any,
  info: any
) => {
  const {
    dropId,
    dropperId,
    engagerUsername,
    interactionType,
    contents
  } = args;
  const { idToken, firestore } = context;
  const verifiedUserId: TUserId = (await admin.auth().verifyIdToken(idToken))
    .uid;
  const engagementId: TEngagementId = uuid.v4();
  const timestamp = new Date();
  const newEngagement: IEngagement = {
    id: engagementId,
    dropId,
    dropperId,
    engagerId: verifiedUserId,
    engagerUsername,
    interactionType,
    contents,
    timestamp,
    bts: {
      webcrawlJobId: "",
      notes: ""
    }
  };
  await Promise.all([
    // create the engagement
    await firestore
      .doc(`${FIRESTORE_ENGAGEMENTS_COLLECTION}/${engagementId}`)
      .set(newEngagement),
    // add an engagement fragment to the drop
    await firestore
      .collection(FIRESTORE_DROPS_COLLECTION)
      .doc(dropId)
      .update({
        engagements: admin.firestore.FieldValue.arrayUnion({
          id: engagementId,
          dropId,
          dropperId,
          engagerId: verifiedUserId,
          engagerUsername,
          interactionType,
          contents,
          timestamp
        })
      })
  ]);
  return engagementId;
};
