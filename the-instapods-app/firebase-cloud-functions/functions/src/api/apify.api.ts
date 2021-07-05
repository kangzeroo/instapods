const ApifyClient = require("apify-client");
const functions = require("firebase-functions");
import {
  IUserAccountSnapshots,
  IApifyInfo,
  IUserAccountSnapshotsAugmented,
  ICrawledDropAugmented,
  IDropSnapshotAugmented
} from "@instapods/firestore-types";
import { CLOUDFN_ON_APIFY_CRAWLED, APIFY_ACTOR_ID } from "../constants";

const apifyClient = new ApifyClient({
  userId: functions.config().apify.userId,
  token: functions.config().apify.token
});

// user.bts.isVerified
export const runVerificationCrawler = async (
  username: string
): Promise<IUserAccountSnapshotsAugmented> => {
  const runInfo: IApifyInfo = await apifyClient.acts.runAct({
    actId: APIFY_ACTOR_ID,
    body: `
            {
                "searchType": "user",
                "directUrls": [
                    "https://www.instagram.com/${username}/"
                ],
                "resultsType": "details",
                "resultsLimit": 30,
                "proxy": {
                    "useApifyProxy": true,
                    "apifyProxyGroups": []
                }
            }
        `,
    contentType: "application/json; charset=utf-8",
    waitForFinish: 60
  });
  const datasetInfo = await apifyClient.datasets.getItems({
    datasetId: runInfo.defaultDatasetId
  });
  const crawledUser: IUserAccountSnapshots = datasetInfo.items[0];
  const augmentedUserSnapshot: IUserAccountSnapshotsAugmented = {
    id: crawledUser.id,
    username: crawledUser.username,
    fullName: crawledUser.fullName,
    biography: crawledUser.biography,
    externalUrl: crawledUser.externalUrl,
    externalUrlShimmed: crawledUser.externalUrlShimmed,
    followersCount: crawledUser.followersCount,
    followsCount: crawledUser.followsCount,
    hasChannel: crawledUser.hasChannel,
    highlightReelCount: crawledUser.highlightReelCount,
    isBusinessAccount: crawledUser.isBusinessAccount,
    joinedRecently: crawledUser.joinedRecently,
    businessCategoryName: crawledUser.businessCategoryName,
    private: crawledUser.private,
    verified: crawledUser.verified,
    profilePicUrl: crawledUser.profilePicUrl,
    profilePicUrlHD: crawledUser.profilePicUrlHD,
    facebookPage: crawledUser.facebookPage,
    igtvVideoCount: crawledUser.igtvVideoCount,
    latestIgtvVideos: crawledUser.latestIgtvVideos,
    postsCount: crawledUser.postsCount,
    latestPosts: crawledUser.latestPosts,
    apifyRunInfo: {
      id: runInfo.id,
      actId: runInfo.actId,
      userId: runInfo.userId,
      startedAt: runInfo.startedAt,
      finishedAt: runInfo.finishedAt,
      status: runInfo.status,
      buildId: runInfo.buildId,
      exitCode: runInfo.exitCode,
      defaultKeyValueStoreId: runInfo.defaultKeyValueStoreId,
      defaultDatasetId: runInfo.defaultRequestQueueId,
      defaultRequestQueueId: runInfo.defaultRequestQueueId,
      buildNumber: runInfo.buildNumber,
      containerUrl: runInfo.containerUrl
    }
  };
  return augmentedUserSnapshot;
};

// drop.crawlSchedule.onRelease
export const crawlDropSnapshot = async (
  dropUrl: string
): Promise<IDropSnapshotAugmented> => {
  const runInfo: IApifyInfo = await apifyClient.acts.runAct({
    actId: "599Fi8BXZsnYrA9Xz",
    body: `
            {
                "searchType": "user",
                "directUrls": [
                    "${dropUrl}"
                ],
                "resultsType": "details",
                "resultsLimit": 1,
                "proxy": {
                "useApifyProxy": true,
                "apifyProxyGroups": []
                }
            }
        `,
    contentType: "application/json; charset=utf-8",
    waitForFinish: 60
  });
  const datasetInfo = await apifyClient.datasets.getItems({
    datasetId: runInfo.defaultDatasetId
  });
  const details = datasetInfo.items[0];
  return {
    type: details.type,
    shortCode: details.shortCode,
    caption: details.caption,
    commentsCount: details.commentsCount,
    dimensionsHeight: details.dimensionsHeight,
    dimensionsWidth: details.dimensionsWidth,
    displayUrl: details.displayUrl,
    likesCount: details.likesCount,
    timestamp: details.timestamp,
    locationName: details.locationName,
    ownerFullName: details.ownerFullName,
    captionIsEdited: details.captionIsEdited,
    hasRankedComments: details.hasRankedComments,
    commentsDisabled: details.commentsDisabled,
    displayResourceUrls: details.displayResourceUrls,
    locationSlug: details.locationSlug,
    ownerUsername: details.ownerUsername,
    isAdvertisement: details.isAdvertisement,
    taggedUsers: details.taggedUsers,
    apifyRunInfo: {
      id: runInfo.id,
      actId: runInfo.actId,
      userId: runInfo.userId,
      startedAt: runInfo.startedAt,
      finishedAt: runInfo.finishedAt,
      status: runInfo.status,
      buildId: runInfo.buildId,
      exitCode: runInfo.exitCode,
      defaultKeyValueStoreId: runInfo.defaultKeyValueStoreId,
      defaultDatasetId: runInfo.defaultRequestQueueId,
      defaultRequestQueueId: runInfo.defaultRequestQueueId,
      buildNumber: runInfo.buildNumber,
      containerUrl: runInfo.containerUrl
    }
  };
};

export const runDropCrawler = async ({
  dropUrl,
  dropId,
  dropperId,
  podIds
}: {
  dropUrl: string;
  dropId: string;
  dropperId: string;
  podIds: Array<string>;
}): Promise<string> => {
  console.log("------------ CLOUDFN_ON_APIFY_CRAWLED");
  console.log(CLOUDFN_ON_APIFY_CRAWLED);
  const runInfo: IApifyInfo = await apifyClient.acts.runAct({
    actId: APIFY_ACTOR_ID,
    body: `
            {
                "searchType": "user",
                "directUrls": [
                    "${dropUrl}"
                ],
                "resultsType": "comments",
                "resultsLimit": 300,
                "proxy": {
                    "useApifyProxy": true,
                    "apifyProxyGroups": []
                }
            }
        `,
    contentType: "application/json; charset=utf-8",
    waitForFinish: 300,
    webhooks: [
      {
        eventTypes: ["ACTOR.RUN.SUCCEEDED"],
        requestUrl: `${CLOUDFN_ON_APIFY_CRAWLED}?dropId=${dropId}&dropperId=${dropperId}&podIds=${podIds.join(
          ","
        )}`
      }
    ]
  });
  return runInfo.defaultDatasetId;
};

export const extractDropCrawlResults = async (
  datasetId: string
): Promise<Array<ICrawledDropAugmented>> => {
  const results = await apifyClient.datasets.getItems({
    datasetId
  });
  return results.items.map((r: any) => ({
    id: r.id,
    text: r.text,
    timestamp: r.timestamp,
    ownerId: r.ownerId,
    ownerIsVerified: r.ownerIsVerified,
    ownerUsername: r.ownerUsername,
    ownerProfilePicUrl: r.ownerProfilePicUrl,
    originalPostUrl: r["#debug"].url
  }));
};

export const extractHashtags = (caption: string) => {
  const firstHashtag = caption.indexOf("#");
  if (firstHashtag && firstHashtag > -1) {
    const hashtags = caption.slice(firstHashtag, caption.length).split("#");
    return hashtags.filter(h => h).map(h => h.trim());
  } else {
    return [];
  }
};

export const stripShareId = (contentUrl: string) => {
  const igshidLoc = contentUrl.indexOf("?igshid");
  if (igshidLoc && igshidLoc > -1) {
    return contentUrl.slice(0, igshidLoc);
  } else {
    return contentUrl;
  }
};
