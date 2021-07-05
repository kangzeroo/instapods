import * as uuid from "uuid";
import {
  ICrawledDropAugmented,
  TDropId,
  TUserId,
  IUser,
  IEngagement,
  IEngagement_Fragment
} from "@instapods/firestore-types";
const admin = require("firebase-admin");
import { InteractionType, FIRESTORE_USERS_COLLECTION } from "../constants";

const firestore = admin.firestore();

export const convertCrawlResultsToEngagements = async ({
  dropId,
  dropperId,
  crawlResults,
  webcrawlJobId
}: {
  dropId: TDropId;
  dropperId: TUserId;
  crawlResults: Array<ICrawledDropAugmented>;
  webcrawlJobId: string;
}): Promise<Array<IEngagement>> => {
  const date = new Date();
  const engagements = await Promise.all(
    crawlResults.map(async r => {
      let userId = "";
      const snapshot = await firestore
        .collection(FIRESTORE_USERS_COLLECTION)
        .where("username", "==", r.ownerUsername)
        .get();
      const users: Array<IUser> = [];
      snapshot.forEach((doc: any) => {
        users.push(doc.data());
      });
      if (users && users[0] && users[0].id) {
        userId = users[0].id;
      }
      return {
        id: uuid.v4(),
        dropId,
        dropperId,
        engagerId: userId,
        engagerUsername: r.ownerUsername,
        interactionType: InteractionType.COMMENT,
        contents: r.text,
        timestamp: date,
        json: JSON.stringify(r),
        bts: {
          webcrawlJobId,
          notes: ""
        }
      };
    })
  );
  const validEngagements = engagements.filter(r => r.engagerId);
  return validEngagements;
};

export const convertEngagementsToFragments = (
  engagements: Array<IEngagement>
): Array<IEngagement_Fragment> => {
  return engagements.map(e => ({
    id: e.id,
    dropId: e.dropId,
    dropperId: e.dropperId,
    engagerId: e.engagerId,
    engagerUsername: e.engagerUsername,
    interactionType: e.interactionType,
    contents: e.contents,
    timestamp: e.timestamp
  }));
};
