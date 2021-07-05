import env from 'react-native-config'

export const {
    WEB_CLIENT_ID,
    SMARTLOOK_API_KEY,
    BUNDLE_ID,
    GRAPHQL_ENDPOINT,
} = env

export const TERMS_AND_CONDITIONS_URL =
    'https://instapods.co/terms-and-conditions'
export const LEARN_MORE_HOW_IT_WORKS_URL =
    'https://www.instapods.co/how-it-works'
export const GETTING_STARTED_GUIDE_URL =
    'https://www.instapods.co/getting-started'
export const FAQ_URL = 'https://www.instapods.co/faq'
export const IG_URL = 'https://www.instagram.com/instapods.app/'
export const INSTAGAM_URL = 'https://www.instagram.com/'
export const KARMA_SYSTEM_GUIDE_URL = 'https://www.instapods.co/karma-system'
export const HOW_TO_FIND_PODS_URL = 'https://www.instapods.co/how-to-find-pods'
export const BEATING_THE_ALGO_URL =
    'https://www.instapods.co/beating-the-ig-algorithm'

export const DROP_INTERACTION_LOCAL_STORAGE: string = 'drop_interactions'
type TInteractionTag = string
export const MARKED_COMPLETE: TInteractionTag = 'MARKED_COMPLETE'
export const DECLINE: TInteractionTag = 'DECLINE'
export const OPENED_FROM_APP: TInteractionTag = 'OPENED_FROM_APP'

export const ROUTES = {
    LOGGED_OUT_SECTION: '/LoginSection',
    LOGIN_HOME_SCREEN: '/LoginSection/index',
    LOGIN_SCREEN: '/LoginSection/login',
    SIGNUP_SCREEN: '/LoginSection/signup',
    CONFIRM_SCREEN: '/LoginSection/confirm',
    UNAUTH_JOIN_POD: '/LoginSection/Pod',
    LOGGED_IN_SECTION: '/LoggedInSection',
    PROFILE_NAVIGATOR: '/LoggedInSection/ProfileNavigator',
    PODSLIST_SCREEN: '/LoggedInSection/PodsNavigator/PodsList',
    CREATEPOD_SCREEN: '/LoggedInSection/PodsNavigator/CreatePod',
    DISCOVER_PODS: '/LoggedInSection/PodsNavigator/DiscoverPods',
    PODVIEW_SCREEN: '/LoggedInSection/PodsNavigator/PodsList/PodView',
    MANAGEPOD_SCREEN: '/LoggedInSection/PodsNavigator/PodsList/PodView/manage',
    PROFILE_ACTIVITY: '/LoggedInSection/Profile/Activity',
    NEW_DROP: '/LoggedInSection/Profile/NewDrop',
    REVIEW_DROP: '/LoggedInSection/Profile/ReviewDrop',
    JOIN_POD: '/LoggedInSection/JoinPod',
    PREVIEW_DROP: '/LoggedInSection/PreviewDrop',
    HELP_FLOOR: '/LoggedInSection/Help',
    WELCOME_ONBOARDING: {
        NAVIGATION: '/WelcomeOnboarding',
        INITIAL_LOADING_SCREEN: '/WelcomeOnboarding/InitialLoadingScreen',
        WELCOME: '/WelcomeOnboarding/WelcomeToInstapods',
        HOW_IT_WORKS: '/WelcomeOnboarding/HowItWorks',
        RULES_OF_ENGAGEMENT: '/WelcomeOnboarding/RulesOfEngagement',
        VERIFY_ACCOUNT: '/WelcomeOnboarding/VerifyAccount',
        NEXT_STEPS: '/WelcomeOnboarding/NextSteps',
    },
    DROP_ONBOARDING: {
        NAVIGATION: '/DemoOnboarding',
        SHARE_POST: '/DemoOnboarding/ShareAPost',
        PICK_PODS: '/DemoOnboarding/PickPods',
        DROP_POSTS: '/DemoOnboarding/DropPosts',
    },
    POD_ONBOARDING: {
        NAVIGATION: '/PodOnboarding',
        START_POD: '/PodOnboarding/StartPod',
        INVITE_PEERS: '/PodOnboarding/InvitePeers',
        KEEP_HEALTHY: '/PodOnboarding/KeepHealthy',
    },
}
