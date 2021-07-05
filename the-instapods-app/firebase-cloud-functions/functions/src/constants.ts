import {
  TInteractionType,
  TDropStatus,
  TAccessStage,
  TPaymentPlan,
  TInteractionCount,
  TKarma
} from "@instapods/firestore-types";

// if you add something here please add to all relevant variables below
export const InteractionTypeArray: Array<TInteractionType> = [
  "LIKE",
  "COMMENT",
  "SHARE",
  "BOOKMARK",
  "ACCEPT",
  "DECLINE",
  "MARKED_COMPLETE",
  "OPENED_FROM_APP"
];

export const InteractionType: { [key: string]: TInteractionType } = {
  LIKE: "LIKE",
  COMMENT: "COMMENT",
  SHARE: "SHARE",
  BOOKMARK: "BOOKMARK",
  ACCEPT: "ACCEPT",
  DECLINE: "DECLINE",
  MARKED_COMPLETE: "MARKED_COMPLETE",
  OPENED_FROM_APP: "OPENED_FROM_APP"
};

/**
 * "interactionCounts" increment counters of various interaction types
 *  - used to calculate the steady karma growth over time
 */
export const InitalInteractionCountObject: {
  [key: string]: TInteractionCount;
} = {
  // is there any way to programtically assign this from InteractionTypeArray??
  LIKE: 0,
  COMMENT: 0,
  SHARE: 0,
  BOOKMARK: 0,
  ACCEPT: 0,
  DECLINE: 0,
  MARKED_COMPLETE: 0,
  OPENED_FROM_APP: 0
};

/**
 * these are baseline karma awards for each interaction type
 * @important these are also hardcoded in the front end, so if you change anything please do so in the front end as well in `src/common/constants.ts`
 */
export const InteractionTypeKarma: {
  [key: string]: TKarma;
} = {
  LIKE: 1,
  COMMENT: 5,
  SHARE: 1,
  BOOKMARK: 1,
  ACCEPT: 1,
  DECLINE: 0,
  MARKED_COMPLETE: 1,
  OPENED_FROM_APP: 1
};

export const DropStatus: { [key: string]: TDropStatus } = {
  PENDING: "PENDING",
  RELEASED: "RELEASED"
};

export const AccessStage: { [key: string]: TAccessStage } = {
  ALPHA: "ALPHA",
  BETA: "BETA",
  PUBLIC_BETA: "PUBLIC_BETA",
  PUBLIC: "PUBLIC",
  NOT_DEFINED: "NOT_DEFINED"
};

export const PaymentPlan: { [key: string]: TPaymentPlan } = {
  FREE: "FREE",
  PAID: "PAID"
};

export const verificationCode = "instapods";

// export const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET;
// export const CLOUDFN_ON_APIFY_CRAWLED = process.env.CLOUDFN_ON_APIFY_CRAWLED;
// export const APIFY_ACTOR_ID = process.env.APIFY_ACTOR_ID;

export const FIREBASE_STORAGE_BUCKET = "the-instapods-app---prod.appspot.com";
export const CLOUDFN_ON_APIFY_CRAWLED =
  "https://us-central1-the-instapods-app---prod.cloudfunctions.net/onApifyCrawled";
export const APIFY_ACTOR_ID = "599Fi8BXZsnYrA9Xz";

export const FIRESTORE_USERS_COLLECTION = "users";
export const FIRESTORE_PODS_COLLECTION = "pods";
export const FIRESTORE_POD_DROP_SUBCOLLECTION = "drops";
export const FIRESTORE_ENGAGEMENTS_COLLECTION = "engagements";
export const FIRESTORE_DROPS_COLLECTION = "drops";
export const FIRESTORE_DROP_CRAWLS_COLLECTION = "dropCrawls";
export const FIRESTORE_DROP_SNAPSHOTS_SUBCOLLECTION = "dropSnapshots";

export const FIRE_KARMA_MULTIPLIER = 2; // multiplies new karma values by this (< 24 hrs for example) - this takes care os "oscillatory karma" nature
export const BASELINE_KARMA_MULTIPLIER = 1; // base karma multiplier - this corresponds to the steady growth of karma based on overall engagements
export const BASE_KARMA = 100;
export const KARMA_HOUR_LIMIT = 24; // in hours
export const EVERY_DAY = "0 0 * * *";
export const EVERY_MINUTE = "* * * * *";

/**
 * This returns a karma update balue for the interactionType
 * @important these are also hardcoded in the front end, so if you change anything please do so in the front end as well in `src/common/constants.ts`
 */
export const returnInteractionValue = (
  interactionType: TInteractionType
): TKarma => {
  if (!(interactionType in InteractionTypeKarma)) {
    // interaction type is not in the InteractionTypeKarma - that may be a problem
    console.log(
      `missing interactionType ${interactionType} in ${InteractionTypeKarma}`
    );
    // default to 1 ???
    return 1;
  }
  return InteractionTypeKarma[interactionType];
};
