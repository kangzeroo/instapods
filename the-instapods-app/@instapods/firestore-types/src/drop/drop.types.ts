import {
  TDropId,
  TUserId,
  TPodId,
  TAccessStage,
  TIsPublicDrop,
  TImageSourceProp,
  TDropStatus,
  IApifyInfo,
  THashtag
} from "../base.types";
import { IEngagement_Fragment } from "../engagement";

export interface IDrop {
  id: TDropId;
  userId: TUserId;
  username: string;
  contentUrl: string;
  image: Array<TImageSourceProp>;
  title: string;
  desc: string;
  scheduledDate: Date;
  droppedDate: Date;
  isPublic: TIsPublicDrop;
  pods: Array<TPodId>;
  engagements: Array<IEngagement_Fragment>;
  hashtags: Array<THashtag>;
  status: TDropStatus;
  bts: {
    accessStage: TAccessStage;
    btsNotes: string;
  };
  snapshot?: IDropSnapshot;
  crawlSchedule: {
    onRelease: boolean;
    [key: number]: boolean;
    isCleared: boolean;
    isInPod?: boolean;
    isCrawling?: boolean; // add this to prevent duplicate apify calls on the same drop
  };
}

export interface IDrop_Fragment {
  id: TDropId;
  userId: TUserId;
  username: string;
  contentUrl: string;
  image: Array<TImageSourceProp>;
  title: string;
  desc: string;
  scheduledDate: Date;
  droppedDate: Date;
}

export interface IDropSnapshot {
  type: string;
  shortCode: string;
  caption: string;
  commentsCount: number;
  dimensionsHeight: number;
  dimensionsWidth: number;
  displayUrl: string;
  likesCount: number;
  timestamp: Date;
  locationName: string;
  ownerFullName: string;
  captionIsEdited: false;
  hasRankedComments: false;
  commentsDisabled: false;
  displayResourceUrls: [string];
  locationSlug: string;
  ownerUsername: string;
  isAdvertisement: false;
  taggedUsers: [string];
}

export interface IDropSnapshotAugmented extends IDropSnapshot {
  apifyRunInfo: IApifyInfo;
}
