const functions = require("firebase-functions");
const admin = require("firebase-admin");
const moment = require("moment");
const firestore = admin.firestore();
import { IDrop } from "@instapods/firestore-types";
import { runDropCrawler } from "../../api/apify.api";
import { DropStatus, FIRESTORE_DROPS_COLLECTION } from "../../constants";

// @ts-ignore
// type DataSnapshot = firebase.database.DataSnapshot

/**
 * @ignore
 */
const EVERY_MINUTE = "* * * * *";
// const EVERY_2_MINUTES = 'every 2 minutes'
const scheduledDropCrawler = functions.pubsub
  .schedule(EVERY_MINUTE)
  .timeZone("Etc/UTC")
  .onRun(async (context: any) => {
    await scheduledDropCrawlerLogic();
    return null;
  });

/**
 * Write the logic here so that TypeDoc documents it
 *
 * @category ___CATEGORY___
 */
const scheduledDropCrawlerLogic = async (): Promise<boolean> => {
  console.log("======== scheduledDropCrawlerLogic ========");
  const afterTimestamp = new Date(
    moment
      .utc()
      .subtract(16, "minutes")
      .format("YYYY-MM-DDTHH:mm:ss.SSS")
  );

  const beforeTimestamp = new Date(
    moment
      .utc()
      .subtract(14, "minutes") // change from seconds to minutes for prod
      .format("YYYY-MM-DDTHH:mm:ss.SSS")
  );
  const snapshot = await firestore
    .collection(FIRESTORE_DROPS_COLLECTION)
    .where("droppedDate", ">=", afterTimestamp)
    .where("droppedDate", "<=", beforeTimestamp)
    .where("status", "==", DropStatus.RELEASED)
    .where("crawlSchedule.10", "==", false)
    .where("crawlSchedule.isCrawling", "==", false)
    .get();

  const drops: Array<IDrop> = [];
  snapshot.forEach((doc: any) => {
    // set the crawlSchedule.isCrawling to true
    const data = doc.data();
    firestore
      .collection(FIRESTORE_DROPS_COLLECTION)
      .doc(data.id)
      .update({ ["crawlSchedule.isCrawling"]: true });
    drops.push(data);
  });
  console.log(drops);
  drops.forEach(d => {
    runDropCrawler({
      dropUrl: d.contentUrl,
      dropId: d.id,
      dropperId: d.userId,
      podIds: d.pods
    }).catch(e => console.log(e));
  });
  return true;
};

export default scheduledDropCrawler;
