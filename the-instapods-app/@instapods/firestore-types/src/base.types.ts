export type TUserId = string; // firestore:/User/${TUserId}
export type TDropId = string; // firestore:/Drop/${TDropId}
export type TPodId = string; // firestore:/Pod/${TPodId}
export type TEngagementId = string; // firestore:/Engagement/${TEngagementId}
export type TKarma = number;

// new karma - keep it simple:
export type TKarmaPod = TKarma; // firestore:/Pod/${TPodID}/karma
export type TKarmaUser = TKarma; // firestore:/User/${TUserID}/karma
export type TInteractionCount = number; // firestore:/User/${TUserID}/

export type TImageSourceProp = {
  uri: string;
  width: number;
  height: number;
};

export type TIsOnline = boolean;
export type TIsPublic = boolean;

export type TIsVerified = boolean;
export type TVerificationCode = string;

export type StringifiedJSON = string;

export type TDropStatus = "PENDING" | "RELEASED" | string;
export const DropStatus = {
  PENDING: "PENDING",
  RELEASED: "RELEASED"
};
export const DropStatusArray = ["PENDING", "RELEASED"];

export type TInteractionType =
  | "LIKE"
  | "COMMENT"
  | "SHARE"
  | "BOOKMARK"
  | "ACCEPT"
  | "DECLINE"
  | "MARKED_COMPLETE"
  | string;

// use IKarmaTotalInteractionCounts for total counts of each interaction type - this gets used to weigh karmas for consistent and gradual overall growth
export interface IInteractionCount {
  [index: string]: TInteractionCount;
}

export type TPodEventType =
  | "JOINED_POD"
  | "LEAVE_POD"
  | "BECAME_ADMIN"
  | "RESIGNED_ADMIN"
  | "INVITE_POD"
  | "ACCEPT_POD_INVITE"
  | "POD_DROP"
  | string;
export const PodEventType = {
  JOINED_POD: "JOINED_POD",
  LEAVE_POD: "LEAVE_POD",
  BECAME_ADMIN: "BECAME_ADMIN",
  RESIGNED_ADMIN: "RESIGNED_ADMIN",
  INVITE_POD: "INVITE_POD",
  ACCEPT_POD_INVITE: "ACCEPT_POD_INVITE",
  POD_DROP: "POD_DROP"
};
export const PodEventTypeArray = [
  "JOINED_POD",
  "LEAVE_POD",
  "BECAME_ADMIN",
  "RESIGNED_ADMIN",
  "INVITE_POD",
  "ACCEPT_POD_INVITE",
  "POD_DROP"
];

export type TAccessStage =
  | "ALPHA"
  | "BETA"
  | "PUBLIC_BETA"
  | "PUBLIC"
  | "NOT_DEFINED"
  | string;
export const AccessStage = {
  ALPHA: "ALPHA",
  BETA: "BETA",
  PUBLIC_BETA: "PUBLIC_BETA",
  PUBLIC: "PUBLIC",
  NOT_DEFINED: "NOT_DEFINED"
};
export const AccessStageArray = [
  "ALPHA",
  "BETA",
  "PUBLIC_BETA",
  "PUBLIC",
  "NOT_DEFINED"
];

export type TPaymentPlan = "FREE" | "PAID" | string;
export type PaymentPlan = {
  FREE: "FREE";
  PAID: "PAID";
};
export const PaymentPlansArray = ["FREE", "PAID"];

export type TIsPublicDrop = boolean;
export type TIsPublicPod = boolean;
export type THashtag = string;

export const mockKarmaScoresArray = [
  100,
  200,
  300,
  400,
  500,
  600,
  700,
  800,
  900
];
export const mockImagesArray = [
  "https://i.picsum.photos/id/538/640/640.jpg",
  "https://i.picsum.photos/id/58/600/600.jpg",
  "https://i.picsum.photos/id/873/600/600.jpg",
  "https://i.picsum.photos/id/547/600/600.jpg",
  "https://i.picsum.photos/id/691/600/600.jpg",
  "https://i.picsum.photos/id/680/600/600.jpg",
  "https://i.picsum.photos/id/703/600/600.jpg",
  "https://i.picsum.photos/id/937/600/600.jpg",
  "https://i.picsum.photos/id/650/600/600.jpg",
  "https://i.picsum.photos/id/668/600/600.jpg",
  "https://i.picsum.photos/id/619/600/600.jpg",
  "https://i.picsum.photos/id/548/600/600.jpg",
  "https://i.picsum.photos/id/401/600/600.jpg",
  "https://i.picsum.photos/id/338/600/600.jpg",
  "https://i.picsum.photos/id/558/600/600.jpg",
  "https://i.picsum.photos/id/2/600/600.jpg",
  "https://i.picsum.photos/id/310/600/600.jpg",
  "https://i.picsum.photos/id/152/600/600.jpg",
  "https://i.picsum.photos/id/386/600/600.jpg",
  "https://i.picsum.photos/id/835/600/600.jpg",
  "https://i.picsum.photos/id/521/600/600.jpg",
  "https://i.picsum.photos/id/586/600/600.jpg",
  "https://i.picsum.photos/id/239/600/600.jpg",
  "https://i.picsum.photos/id/617/600/600.jpg",
  "https://i.picsum.photos/id/1019/600/600.jpg",
  "https://i.picsum.photos/id/435/600/600.jpg",
  "https://i.picsum.photos/id/239/600/600.jpg",
  "https://i.picsum.photos/id/993/600/600.jpg",
  "https://i.picsum.photos/id/985/600/600.jpg",
  "https://i.picsum.photos/id/1018/600/600.jpg",
  "https://i.picsum.photos/id/805/600/600.jpg",
  "https://i.picsum.photos/id/1008/600/600.jpg",
  "https://i.picsum.photos/id/628/600/600.jpg",
  "https://i.picsum.photos/id/141/600/600.jpg",
  "https://i.picsum.photos/id/1040/600/600.jpg",
  "https://i.picsum.photos/id/294/600/600.jpg",
  "https://i.picsum.photos/id/504/600/600.jpg",
  "https://i.picsum.photos/id/389/600/600.jpg",
  "https://i.picsum.photos/id/616/600/600.jpg",
  "https://i.picsum.photos/id/1053/600/600.jpg",
  "https://i.picsum.photos/id/545/600/600.jpg",
  "https://i.picsum.photos/id/622/600/600.jpg",
  "https://i.picsum.photos/id/572/600/600.jpg",
  "https://i.picsum.photos/id/794/600/600.jpg",
  "https://i.picsum.photos/id/145/600/600.jpg"
];

export interface IApifyInfo {
  id: string;
  actId: string;
  userId: string;
  startedAt: Date;
  finishedAt: Date | null;
  status: string;
  buildId: string;
  exitCode: number | undefined;
  defaultKeyValueStoreId: string;
  defaultDatasetId: string;
  defaultRequestQueueId: string;
  buildNumber: string;
  containerUrl: string;
}

export type TFcmToken = string;
export type TFcmTopic = TPodId;
