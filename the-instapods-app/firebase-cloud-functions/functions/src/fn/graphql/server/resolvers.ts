import {
  createPod,
  listMyPods,
  getPodDetailsAsMember,
  getPodDetailsAsAdmin,
  joinPod,
  leavePod,
  kickPodMembers,
  promotePodMembers,
  demotePodMembers,
  updatePodPrivateDescription,
  discoverPublicPod,
  getPodDetailsAsInvitee
} from "./resolvers/pod";
import {
  createDrop,
  releaseDrop,
  viewDropPreEngagement,
  viewMyDropResults,
  DropResultsResolver
} from "./resolvers/drop";
import {
  getMyProfile,
  updateMyProfile,
  PrivateUserResolver,
  getUserRelationshipProfile,
  verifyAccount,
  updateOnboardingSchedule,
  updateUserPushNotificationToken
} from "./resolvers/user";
import { engageDrop } from "./resolvers/engagement";

const resolverFunctions = {
  Query: {
    getMyProfile,
    listMyPods,
    getPodDetailsAsMember,
    getPodDetailsAsAdmin,
    viewDropPreEngagement,
    viewMyDropResults,
    getUserRelationshipProfile,
    discoverPublicPod,
    getPodDetailsAsInvitee
  },
  Mutation: {
    createPod,
    createDrop,
    updateMyProfile,
    engageDrop,
    joinPod,
    leavePod,
    kickPodMembers,
    promotePodMembers,
    demotePodMembers,
    updatePodPrivateDescription,
    releaseDrop,
    verifyAccount,
    updateOnboardingSchedule,
    updateUserPushNotificationToken
  },
  DropResults: DropResultsResolver,
  PrivateUser: PrivateUserResolver
};

export default resolverFunctions;
