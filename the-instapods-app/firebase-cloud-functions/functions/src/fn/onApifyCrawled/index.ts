const functions = require("firebase-functions");
const admin = require("firebase-admin");
import { extractDropCrawlResults } from "../../api/apify.api";
import {
  convertCrawlResultsToEngagements,
  convertEngagementsToFragments
} from "../../api/firestore.api";
import {
  ICrawledDropResults,
  ICrawledDropAugmented,
  IEngagement,
  IDrop,
  IEngagement_Fragment
} from "@instapods/firestore-types";
import {
  FIRESTORE_DROPS_COLLECTION,
  FIRESTORE_DROP_CRAWLS_COLLECTION,
  FIRESTORE_DROP_SNAPSHOTS_SUBCOLLECTION,
  FIRESTORE_ENGAGEMENTS_COLLECTION
} from "../../constants";

const firestore = admin.firestore();

// @ts-ignore
// type DataSnapshot = firebase.database.DataSnapshot

/**
 * @ignore
 */
const onApifyCrawled = functions.https.onRequest(async (req: any, res: any) => {
  console.log("============ onApifyCrawled ============");
  console.log(req.query.podIds.split(","));
  await onApifyCrawledLogic(
    req.body,
    req.query.dropId,
    req.query.dropperId,
    req.query.podIds.split(",")
  );
  res.send(200);
});

/**
 * Write the logic here so that TypeDoc documents it
 *
 * @category ___CATEGORY___
 */
const onApifyCrawledLogic = async (
  data: any,
  dropId: string,
  dropperId: string,
  podIds: Array<string>
): Promise<ICrawledDropResults> => {
  const results: Array<ICrawledDropAugmented> = await extractDropCrawlResults(
    data.resource.defaultDatasetId
  );
  const doc = await firestore
    .collection(FIRESTORE_DROPS_COLLECTION)
    .doc(dropId)
    .get();
  const originalDrop: IDrop = doc.data();
  const webcrawlJobId = data.resource.id;
  const engagements: Array<IEngagement> = await convertCrawlResultsToEngagements(
    { dropId, dropperId, crawlResults: results, webcrawlJobId }
  );
  const engagementFragments = convertEngagementsToFragments(engagements);
  const crawledResults = {
    dropId,
    dropperId,
    engagements: results,
    podIds,
    apify: {
      id: webcrawlJobId,
      actId: data.resource.actId,
      userId: data.resource.userId,
      startedAt: data.resource.startedAt,
      finishedAt: data.resource.finishedAt,
      status: data.resource.status,
      buildId: data.resource.buildId,
      exitCode: data.resource.exitCode,
      defaultKeyValueStoreId: data.resource.defaultKeyValueStoreId,
      defaultDatasetId: data.resource.defaultDatasetId,
      defaultRequestQueueId: data.resource.defaultRequestQueueId,
      buildNumber: data.resource.buildNumber,
      containerUrl: data.resource.containerUrl
    }
  };
  await Promise.all([
    // adds a new drop crawl record
    await firestore
      .collection(FIRESTORE_DROP_CRAWLS_COLLECTION)
      .doc(crawledResults.dropId)
      .collection(FIRESTORE_DROP_SNAPSHOTS_SUBCOLLECTION)
      .doc(crawledResults.apify.id)
      .set(crawledResults),
    // updates the drop with engagementFragments
    await firestore
      .collection(FIRESTORE_DROPS_COLLECTION)
      .doc(crawledResults.dropId)
      .update({
        engagements: originalDrop.engagements.concat(
          engagementFragments.filter(
            (eng: IEngagement_Fragment) => eng.engagerId !== dropperId
          )
        ),
        ["crawlSchedule.10"]: true, // this triggers onDropCrawlSchedule which updates all pod + user karmas!
        ["crawlSchedule.isCrawling"]: false
      }),
    // creates all the new engagements
    ...engagements.map(async eng => {
      console.log("compare... ", eng.engagerId, dropperId);
      if (eng.engagerId == dropperId) {
        // don't count the users own engagements lol - i.e. user comenting on their own post
        return;
      }
      await firestore
        .doc(`${FIRESTORE_ENGAGEMENTS_COLLECTION}/${eng.id}`)
        .set(eng);
      return eng.id;
    })
  ]);
  return crawledResults;
};

export default onApifyCrawled;
