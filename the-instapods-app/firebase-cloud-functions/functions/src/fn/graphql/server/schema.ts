const { gql } = require("apollo-server-cloud-functions");

// refactor getMe() and listMyPods() to not require a userId since it can be grabbed from the auth token
const schema = gql`
  type Query {
    getMyProfile: PrivateUser!
    listMyPods: [PodPreview!]!
    getPodDetailsAsInvitee(podId: String!): PodAsInvitee!
    getPodDetailsAsMember(podId: String!): PodAsMember!
    getPodDetailsAsAdmin(podId: String!): PodAsAdmin!
    viewDropPreEngagement(dropId: String!): DropPreEngagement!
    viewMyDropResults(dropId: String!): DropResults!
    getUserRelationshipProfile(
      theirId: String!
    ): PublicUserWithKarmaRelationship!
    discoverPublicPod(slug: String!): PublicPodPreview
  }
  type Mutation {
    createPod(
      name: String!
      slug: String!
      desc: String!
      hashtags: [String!]!
    ): String!
    createDrop(
      contentUrl: String!
      title: String!
      desc: String!
      scheduledDate: Date
      podIds: [String!]!
    ): String!
    updateMyProfile(username: String!): String!
    engageDrop(
      dropId: String!
      dropperId: String!
      engagerUsername: String!
      interactionType: String!
      contents: String
    ): String!
    joinPod(podId: String!): String!
    leavePod(podId: String!): String!
    kickPodMembers(podId: String!, offenderIds: [String!]!): [String!]!
    promotePodMembers(podId: String!, userIds: [String!]!): [String!]!
    demotePodMembers(podId: String!, userIds: [String!]!): [String!]!
    updatePodPrivateDescription(
      podId: String!
      privateDescription: String!
    ): String!
    releaseDrop(dropId: String!): String!
    verifyAccount(username: String!): String!
    updateOnboardingSchedule(onboardingEvent: String!): String!
    updateUserPushNotificationToken(token: String!): String!
  }

  type PrivateUser {
    id: ID!
    username: String!
    image: [TImageSourceProp!]!
    isPublic: Boolean
    isOnline: Boolean
    karma: Int!
    drops: [Drop_Fragment!]!
    isVerified: Boolean!
    verificationCode: String!
    onboardingSchedule: UserOnboardingSchedule
  }

  type UserOnboardingSchedule {
    welcomeLesson: Date
    agreeToToC: Date
    newDropLesson: Date
    newPodLesson: Date
  }

  type DropPreEngagement {
    id: ID!
    username: String!
    contentUrl: String!
    image: [TImageSourceProp!]!
    title: String!
    desc: String
    isPublic: Boolean
    userId: String!
    userImage: [TImageSourceProp!]!
    userKarma: Int!
    droppedDate: Date
  }

  type DropResults {
    id: ID!
    userId: String!
    username: String!
    contentUrl: String!
    image: [TImageSourceProp!]!
    title: String!
    desc: String
    scheduledDate: Date
    droppedDate: Date
    isPublic: Boolean
    pods: [PodPreview!]!
    engagements: [Engagement_Fragment!]!
    status: String!
    hashtags: [String!]!
  }

  type Drop_Fragment {
    id: ID!
    userId: String!
    username: String!
    contentUrl: String!
    droppedDate: Date
    image: [TImageSourceProp!]!
    title: String
    desc: String
    scheduledDate: Date
  }

  type Engagement_Fragment {
    id: ID!
    dropId: String!
    dropperId: String!
    engagerId: String!
    engagerUsername: String!
    interactionType: String!
    contents: String
    timestamp: Date
  }

  type PodPreview {
    id: ID!
    name: String!
    slug: String!
    publicDescription: String
    image: [TImageSourceProp!]!
    hashtags: [String!]!
    recentDrops: [Drop_Fragment!]!
    isPublic: Boolean!
    karma: Int!
    members: [String!]!
  }

  type PublicPodPreview {
    id: ID!
    name: String!
    slug: String!
    publicDescription: String
    image: [TImageSourceProp!]!
    recentDropsCount: Int!
    membersCount: Int!
    karma: Int!
  }

  type PodAsInvitee {
    id: ID!
    name: String!
    slug: String!
    publicDescription: String
    image: [TImageSourceProp!]!
    hashtags: [String!]!
    membersCount: Int!
    isPublic: Boolean!
    karma: Int!
  }

  type PodAsMember {
    id: ID!
    name: String!
    slug: String!
    publicDescription: String
    privateDescription: String
    image: [TImageSourceProp!]!
    hashtags: [String!]!
    admins: [PublicUser!]!
    members: [PublicUser!]!
    recentDrops: [Drop_Fragment!]!
    isPublic: Boolean!
    karma: Int!
  }

  type PodAsAdmin {
    id: ID!
    name: String!
    slug: String!
    publicDescription: String
    privateDescription: String
    image: [TImageSourceProp!]!
    hashtags: [String!]!
    admins: [PublicUser!]!
    members: [PublicUser!]!
    recentDrops: [Drop_Fragment!]!
    isPublic: Boolean!
    karma: Int!
  }

  type PublicUser {
    id: ID!
    username: String!
    image: [TImageSourceProp!]!
    isPublic: Boolean
    isOnline: Boolean
    karma: Int!
  }

  type PublicUserWithKarmaRelationship {
    id: ID!
    username: String!
    image: [TImageSourceProp!]!
    isPublic: Boolean
    isOnline: Boolean
    karma: Int!
  }

  type TImageSourceProp {
    uri: String
    width: Int
    height: Int
  }
  scalar Date
`;

export default schema;
