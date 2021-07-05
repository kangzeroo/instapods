const functions = require("firebase-functions");
const admin = require("firebase-admin");
const moment = require("moment");
const firestore = admin.firestore();
import { IDrop, TDropId } from "@instapods/firestore-types";
import { EVERY_MINUTE, FIRESTORE_DROPS_COLLECTION } from "../../constants";

// @ts-ignore
// type DataSnapshot = firebase.database.DataSnapshot

/**
 * @ignore
 */
const scheduleDropFragmentCleaner = functions.pubsub
  .schedule(EVERY_MINUTE)
  .timeZone("Etc/UTC")
  .onRun(async (context: any) => {
    await scheduleDropFragmentCleanerLogic();
    return null;
  });

/**
 * Write the logic here so that TypeDoc documents it
 *
 * @category ___CATEGORY___
 */
const scheduleDropFragmentCleanerLogic = async (): Promise<Array<TDropId>> => {
  console.log("======== scheduledDropCrawlerLogic ========");
  const afterTimestamp = new Date(
    moment
      .utc()
      .subtract(60 * 24 + 2, "minutes")
      .format("YYYY-MM-DDTHH:mm:ss.SSS")
  );
  const beforeTimestamp = new Date(
    moment
      .utc()
      // .subtract(14, "seconds") // change this from seconds to (60 * 24 - 2, "minutes")
      .subtract(60 * 24 - 2, "minutes")
      .format("YYYY-MM-DDTHH:mm:ss.SSS")
  );
  // first get all the drops that are approaching 24 hours since release
  // and set all of their crawlSchedule.isCleared = true
  const dropsSnapshot = await firestore
    .collection(FIRESTORE_DROPS_COLLECTION)
    .where("droppedDate", ">=", afterTimestamp)
    .where("droppedDate", "<=", beforeTimestamp)
    .where("crawlSchedule.isCleared", "==", false)
    .get();
  const drops: Array<IDrop> = [];
  dropsSnapshot.forEach((doc: any) => {
    drops.push(doc.data());
  });
  await Promise.all([
    ...drops.map(async d => {
      return await firestore
        .collection(FIRESTORE_DROPS_COLLECTION)
        .doc(d.id)
        .update({
          ["crawlSchedule.isCleared"]: true
        });
    })
  ]);
  const dropIds = drops.map(d => d.id);
  return dropIds;
};

export default scheduleDropFragmentCleaner;
