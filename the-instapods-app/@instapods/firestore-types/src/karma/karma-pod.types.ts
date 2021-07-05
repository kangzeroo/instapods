import {
  evIJoinedPod,
  evILeftPod,
  evIInvitedToPod,
  evIInviteAcceptedToPod,
  evIDropIntoPod,
  evIEngagedDropFromPod,
  evIResignPodAdmin,
  evIAssignPodAdmin,
  evIBecomePodAdmin
} from "./karma-events.types";

export type TPodKarmaScore = number;

export type KARMA_POD_EVENTS_IKarma_Pod =
  | evIJoinedPod
  | evILeftPod
  | evIInvitedToPod
  | evIInviteAcceptedToPod
  | evIResignPodAdmin
  | evIAssignPodAdmin
  | evIBecomePodAdmin;
export type KARMA_DROP_EVENTS_IKarma_Pod = evIDropIntoPod;
export type KARMA_ENGAGEMENT_EVENTS_IKarma_Pod = evIEngagedDropFromPod;
