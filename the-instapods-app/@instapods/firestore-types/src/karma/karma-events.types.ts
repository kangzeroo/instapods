import {
  TDropKey,
  TPodKey,
  TUserKey,
  TEngagementKey
} from "./karma-legend.types";
import { TInteractionType } from "../base.types";

// SELF EVENTS
export interface evICreatedAccount {
  eventName: "evCreatedAccount";
  userKey: TUserKey;
  timestamp: Date;
}
export interface evIVerifiedAccount {
  eventName: "evVerifiedAccount";
  userKey: TUserKey;
  timestamp: Date;
}
export interface evILoggedIn {
  eventName: "evLoggedIn";
  userKey: TUserKey;
  timestamp: Date;
}
export interface evILoggedOut {
  eventName: "evLoggedOut";
  userKey: TUserKey;
  timestamp: Date;
}
export interface evISessionStart {
  eventName: "evSessionStart";
  userKey: TUserKey;
  timestamp: Date;
}
export interface evISessionEnd {
  eventName: "evSessionEnd";
  userKey: TUserKey;
  timestamp: Date;
}

// POD EVENTS
export interface evIJoinedPod {
  eventName: "evJoinedPod";
  userKey: TUserKey;
  podKey: TPodKey;
  timestamp: Date;
}
export interface evILeftPod {
  eventName: "evLeftPod";
  userKey: TUserKey;
  podKey: TPodKey;
  timestamp: Date;
}
export interface evIInvitedToPod {
  eventName: "evInvitedToPod";
  inviterUserKey: TUserKey;
  inviteeUserKey: TUserKey;
  podKey: TPodKey;
  timestamp: Date;
}
export interface evIInviteAcceptedToPod {
  eventName: "evInviteAcceptedToPod";
  inviterUserKey: TUserKey;
  inviteeUserKey: TUserKey;
  podKey: TPodKey;
  timestamp: Date;
}
export interface evIDropIntoPod {
  eventName: "evDropIntoPod";
  userKey: TUserKey;
  dropKey: TDropKey;
  podKey: TPodKey;
  timestamp: Date;
}
export interface evIEngagedDropFromPod {
  eventName: "evEngagedDropFromPod";
  dropKey: TDropKey;
  dropperKey: TUserKey;
  engagerKey: TDropKey;
  podKey: TPodKey;
  timestamp: Date;
}
export interface evIResignPodAdmin {
  eventName: "evResignPodAdmin";
  userKey: TDropKey;
  podKey: TPodKey;
  timestamp: Date;
}
export interface evIAssignPodAdmin {
  eventName: "evAssignPodAdmin";
  userKey: TDropKey;
  assignedByUserKey: TDropKey;
  podKey: TPodKey;
  timestamp: Date;
}
export interface evIBecomePodAdmin {
  eventName: "evBecomePodAdmin";
  userKey: TDropKey;
  podKey: TPodKey;
  timestamp: Date;
}

// DROP EVENTS
export interface evICreateDrop {
  eventName: "evCreateDrop";
  userKey: TUserKey;
  dropKey: TDropKey;
  timestamp: Date;
}
export interface evIReleaseDrop {
  eventName: "evReleaseDrop";
  userKey: TUserKey;
  dropKey: TDropKey;
  podKeys: Array<TPodKey>;
  timestamp: Date;
}

// ENGAGEMENT EVENTS
export interface evIEngagedDrop {
  eventName: "evEngagedDrop";
  engagementKey: TEngagementKey;
  interactionType: TInteractionType;
  dropKey: TDropKey;
  dropperKey: TUserKey;
  engagerKey: TUserKey;
  contents: string;
  timestamp: Date;
}
