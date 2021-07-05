import {
  evICreatedAccount,
  evIVerifiedAccount,
  evILoggedIn,
  evILoggedOut,
  evISessionStart,
  evISessionEnd,
  evIJoinedPod,
  evILeftPod,
  evIInvitedToPod,
  evIInviteAcceptedToPod,
  evIResignPodAdmin,
  evIBecomePodAdmin,
  evICreateDrop,
  evIReleaseDrop,
  evIEngagedDrop
} from "./karma-events.types";

export type KARMA_SELF_EVENTS_IKarma_User =
  | evICreatedAccount
  | evIVerifiedAccount
  | evILoggedIn
  | evILoggedOut
  | evISessionStart
  | evISessionEnd;
export type KARMA_POD_EVENTS_IKarma_User =
  | evIJoinedPod
  | evILeftPod
  | evIInvitedToPod
  | evIInviteAcceptedToPod
  | evIResignPodAdmin
  | evIBecomePodAdmin;
export type KARMA_DROP_EVENTS_IKarma_User = evICreateDrop | evIReleaseDrop;
export type KARMA_ENGAGEMENT_EVENTS_IKarma_User = evIEngagedDrop;
