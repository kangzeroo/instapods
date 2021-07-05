import {
  TEngagementId,
  TDropId,
  TUserId,
  TInteractionType,
  IApifyInfo,
  StringifiedJSON
} from "../base.types";

export interface IEngagement {
  id: TEngagementId;
  dropId: TDropId;
  dropperId: TUserId;
  engagerId: TUserId;
  engagerUsername: string;
  interactionType: TInteractionType;
  contents: string;
  timestamp: Date;
  json?: StringifiedJSON;
  bts: {
    webcrawlJobId: string;
    notes: string;
  };
}

export interface IEngagement_Fragment {
  id: TEngagementId;
  dropId: TDropId;
  dropperId: TUserId;
  engagerId: TUserId;
  engagerUsername: string;
  interactionType: TInteractionType;
  contents: string;
  timestamp: Date;
}

export interface ICrawledDrop {
  id: string;
  text: string;
  timestamp: Date;
  ownerId: string;
  ownerIsVerified: boolean;
  ownerUsername: string;
  ownerProfilePicUrl: string;
  originalPostUrl: string;
}

export interface ICrawledDropAugmented extends ICrawledDrop {
  interactionType: TInteractionType;
}

export interface ICrawledDropResults {
  dropId: string;
  dropperId: string;
  podIds: Array<string>;
  engagements: Array<ICrawledDropAugmented>;
  apify: IApifyInfo;
}
