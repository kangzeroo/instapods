export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


export type Drop_Fragment = {
   __typename?: 'Drop_Fragment';
  id: Scalars['ID'];
  userId: Scalars['String'];
  username: Scalars['String'];
  contentUrl: Scalars['String'];
  droppedDate?: Maybe<Scalars['Date']>;
  image: Array<TImageSourceProp>;
  title?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['String']>;
  scheduledDate?: Maybe<Scalars['Date']>;
};

export type DropPreEngagement = {
   __typename?: 'DropPreEngagement';
  id: Scalars['ID'];
  username: Scalars['String'];
  contentUrl: Scalars['String'];
  image: Array<TImageSourceProp>;
  title: Scalars['String'];
  desc?: Maybe<Scalars['String']>;
  isPublic?: Maybe<Scalars['Boolean']>;
  userId: Scalars['String'];
  userImage: Array<TImageSourceProp>;
  userKarma: Scalars['Int'];
  droppedDate?: Maybe<Scalars['Date']>;
};

export type DropResults = {
   __typename?: 'DropResults';
  id: Scalars['ID'];
  userId: Scalars['String'];
  username: Scalars['String'];
  contentUrl: Scalars['String'];
  image: Array<TImageSourceProp>;
  title: Scalars['String'];
  desc?: Maybe<Scalars['String']>;
  scheduledDate?: Maybe<Scalars['Date']>;
  droppedDate?: Maybe<Scalars['Date']>;
  isPublic?: Maybe<Scalars['Boolean']>;
  pods: Array<PodPreview>;
  engagements: Array<Engagement_Fragment>;
  status: Scalars['String'];
  hashtags: Array<Scalars['String']>;
};

export type Engagement_Fragment = {
   __typename?: 'Engagement_Fragment';
  id: Scalars['ID'];
  dropId: Scalars['String'];
  dropperId: Scalars['String'];
  engagerId: Scalars['String'];
  engagerUsername: Scalars['String'];
  interactionType: Scalars['String'];
  contents?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['Date']>;
};

export type Mutation = {
   __typename?: 'Mutation';
  createPod: Scalars['String'];
  createDrop: Scalars['String'];
  updateMyProfile: Scalars['String'];
  engageDrop: Scalars['String'];
  joinPod: Scalars['String'];
  leavePod: Scalars['String'];
  kickPodMembers: Array<Scalars['String']>;
  promotePodMembers: Array<Scalars['String']>;
  demotePodMembers: Array<Scalars['String']>;
  updatePodPrivateDescription: Scalars['String'];
  releaseDrop: Scalars['String'];
  verifyAccount: Scalars['String'];
  updateOnboardingSchedule: Scalars['String'];
  updateUserPushNotificationToken: Scalars['String'];
};


export type MutationCreatePodArgs = {
  name: Scalars['String'];
  slug: Scalars['String'];
  desc: Scalars['String'];
  hashtags: Array<Scalars['String']>;
};


export type MutationCreateDropArgs = {
  contentUrl: Scalars['String'];
  title: Scalars['String'];
  desc: Scalars['String'];
  scheduledDate?: Maybe<Scalars['Date']>;
  podIds: Array<Scalars['String']>;
};


export type MutationUpdateMyProfileArgs = {
  username: Scalars['String'];
};


export type MutationEngageDropArgs = {
  dropId: Scalars['String'];
  dropperId: Scalars['String'];
  engagerUsername: Scalars['String'];
  interactionType: Scalars['String'];
  contents?: Maybe<Scalars['String']>;
};


export type MutationJoinPodArgs = {
  podId: Scalars['String'];
};


export type MutationLeavePodArgs = {
  podId: Scalars['String'];
};


export type MutationKickPodMembersArgs = {
  podId: Scalars['String'];
  offenderIds: Array<Scalars['String']>;
};


export type MutationPromotePodMembersArgs = {
  podId: Scalars['String'];
  userIds: Array<Scalars['String']>;
};


export type MutationDemotePodMembersArgs = {
  podId: Scalars['String'];
  userIds: Array<Scalars['String']>;
};


export type MutationUpdatePodPrivateDescriptionArgs = {
  podId: Scalars['String'];
  privateDescription: Scalars['String'];
};


export type MutationReleaseDropArgs = {
  dropId: Scalars['String'];
};


export type MutationVerifyAccountArgs = {
  username: Scalars['String'];
};


export type MutationUpdateOnboardingScheduleArgs = {
  onboardingEvent: Scalars['String'];
};


export type MutationUpdateUserPushNotificationTokenArgs = {
  token: Scalars['String'];
};

export type PodAsAdmin = {
   __typename?: 'PodAsAdmin';
  id: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
  publicDescription?: Maybe<Scalars['String']>;
  privateDescription?: Maybe<Scalars['String']>;
  image: Array<TImageSourceProp>;
  hashtags: Array<Scalars['String']>;
  admins: Array<PublicUser>;
  members: Array<PublicUser>;
  recentDrops: Array<Drop_Fragment>;
  isPublic: Scalars['Boolean'];
  karma: Scalars['Int'];
};

export type PodAsInvitee = {
   __typename?: 'PodAsInvitee';
  id: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
  publicDescription?: Maybe<Scalars['String']>;
  image: Array<TImageSourceProp>;
  hashtags: Array<Scalars['String']>;
  membersCount: Scalars['Int'];
  isPublic: Scalars['Boolean'];
  karma: Scalars['Int'];
};

export type PodAsMember = {
   __typename?: 'PodAsMember';
  id: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
  publicDescription?: Maybe<Scalars['String']>;
  privateDescription?: Maybe<Scalars['String']>;
  image: Array<TImageSourceProp>;
  hashtags: Array<Scalars['String']>;
  admins: Array<PublicUser>;
  members: Array<PublicUser>;
  recentDrops: Array<Drop_Fragment>;
  isPublic: Scalars['Boolean'];
  karma: Scalars['Int'];
};

export type PodPreview = {
   __typename?: 'PodPreview';
  id: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
  publicDescription?: Maybe<Scalars['String']>;
  image: Array<TImageSourceProp>;
  hashtags: Array<Scalars['String']>;
  recentDrops: Array<Drop_Fragment>;
  isPublic: Scalars['Boolean'];
  karma: Scalars['Int'];
  members: Array<Scalars['String']>;
};

export type PrivateUser = {
   __typename?: 'PrivateUser';
  id: Scalars['ID'];
  username: Scalars['String'];
  image: Array<TImageSourceProp>;
  isPublic?: Maybe<Scalars['Boolean']>;
  isOnline?: Maybe<Scalars['Boolean']>;
  karma: Scalars['Int'];
  drops: Array<Drop_Fragment>;
  isVerified: Scalars['Boolean'];
  verificationCode: Scalars['String'];
  onboardingSchedule?: Maybe<UserOnboardingSchedule>;
};

export type PublicPodPreview = {
   __typename?: 'PublicPodPreview';
  id: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
  publicDescription?: Maybe<Scalars['String']>;
  image: Array<TImageSourceProp>;
  recentDropsCount: Scalars['Int'];
  membersCount: Scalars['Int'];
  karma: Scalars['Int'];
};

export type PublicUser = {
   __typename?: 'PublicUser';
  id: Scalars['ID'];
  username: Scalars['String'];
  image: Array<TImageSourceProp>;
  isPublic?: Maybe<Scalars['Boolean']>;
  isOnline?: Maybe<Scalars['Boolean']>;
  karma: Scalars['Int'];
};

export type PublicUserWithKarmaRelationship = {
   __typename?: 'PublicUserWithKarmaRelationship';
  id: Scalars['ID'];
  username: Scalars['String'];
  image: Array<TImageSourceProp>;
  isPublic?: Maybe<Scalars['Boolean']>;
  isOnline?: Maybe<Scalars['Boolean']>;
  karma: Scalars['Int'];
};

export type Query = {
   __typename?: 'Query';
  getMyProfile: PrivateUser;
  listMyPods: Array<PodPreview>;
  getPodDetailsAsInvitee: PodAsInvitee;
  getPodDetailsAsMember: PodAsMember;
  getPodDetailsAsAdmin: PodAsAdmin;
  viewDropPreEngagement: DropPreEngagement;
  viewMyDropResults: DropResults;
  getUserRelationshipProfile: PublicUserWithKarmaRelationship;
  discoverPublicPod?: Maybe<PublicPodPreview>;
};


export type QueryGetPodDetailsAsInviteeArgs = {
  podId: Scalars['String'];
};


export type QueryGetPodDetailsAsMemberArgs = {
  podId: Scalars['String'];
};


export type QueryGetPodDetailsAsAdminArgs = {
  podId: Scalars['String'];
};


export type QueryViewDropPreEngagementArgs = {
  dropId: Scalars['String'];
};


export type QueryViewMyDropResultsArgs = {
  dropId: Scalars['String'];
};


export type QueryGetUserRelationshipProfileArgs = {
  theirId: Scalars['String'];
};


export type QueryDiscoverPublicPodArgs = {
  slug: Scalars['String'];
};

export type TImageSourceProp = {
   __typename?: 'TImageSourceProp';
  uri?: Maybe<Scalars['String']>;
  width?: Maybe<Scalars['Int']>;
  height?: Maybe<Scalars['Int']>;
};

export type UserOnboardingSchedule = {
   __typename?: 'UserOnboardingSchedule';
  welcomeLesson?: Maybe<Scalars['Date']>;
  agreeToToC?: Maybe<Scalars['Date']>;
  newDropLesson?: Maybe<Scalars['Date']>;
  newPodLesson?: Maybe<Scalars['Date']>;
};
