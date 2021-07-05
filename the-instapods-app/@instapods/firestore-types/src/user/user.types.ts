import {
  TUserId,
  TAccessStage,
  TImageSourceProp,
  IApifyInfo,
  TKarmaUser,
  IInteractionCount,
  TIsPublic,
  TIsOnline,
  TIsVerified,
  TVerificationCode,
  TFcmToken
} from "../base.types";
// import { TKarma_User_Fragment } from "../karma";

type User_username = string;

export interface IUser {
  id: TUserId;
  username: User_username;
  email: string;
  image: Array<TImageSourceProp>;
  isPublic: TIsPublic;
  isOnline: TIsOnline;
  karma: TKarmaUser; // this is new karma - a simple number that get updated on the fly
  totalInteractionCounts: IInteractionCount;
  bts: {
    accessStage: TAccessStage;
    createdAt: Date;
    lastOnline: Date;
    notes: string;
    verificationCode: TVerificationCode;
    isVerified: TIsVerified;
    instagramId: string;
    followersCount: number;
    followsCount: number;
    isInstagramVerified: boolean;
    isPrivateAccount: boolean;
    isBusinessAccount: boolean;
    onboardingSchedule: IOnboardingSchedule;
    fcmToken: TFcmToken;
  };
  accountSnapshots: Array<IUserAccountSnapshotsAugmentedStringified>;
}

export interface IOnboardingSchedule {
  welcomeLesson?: string;
  agreeToToC?: string;
  newDropLesson?: string;
  newPodLesson?: string;
  [key: string]: string | undefined;
}

export interface IPublicUser {
  id: TUserId;
  username: User_username;
  image: Array<TImageSourceProp>;
  isPublic: TIsPublic;
  isOnline: TIsOnline;
  karma: TKarmaUser;
}

export interface IUserProfile {
  id: TUserId;
  username: User_username;
  image: Array<TImageSourceProp>;
  isPublic: TIsPublic;
  isOnline: TIsOnline;
  karma: TKarmaUser;
  isVerified: TIsVerified;
  verificationCode: TVerificationCode;
}

export type IUserAccountSnapshotsAugmentedStringified = string; // JSON string
export interface IUserAccountSnapshots {
  id: string;
  username: string;
  fullName: string;
  biography: string;
  externalUrl: string;
  externalUrlShimmed: string;
  followersCount: number;
  followsCount: number;
  hasChannel: boolean;
  highlightReelCount: number;
  isBusinessAccount: boolean;
  joinedRecently: boolean;
  businessCategoryName: string;
  private: boolean;
  verified: boolean;
  profilePicUrl: string;
  profilePicUrlHD: string;
  facebookPage: string;
  igtvVideoCount: number;
  latestIgtvVideos: Array<any>;
  postsCount: number;
  latestPosts: Array<IUserAccountSnapshotRecentPost>;
}

export interface IUserAccountSnapshotRecentPost {
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
}

export interface IUserAccountSnapshotsAugmented extends IUserAccountSnapshots {
  apifyRunInfo: IApifyInfo;
}
