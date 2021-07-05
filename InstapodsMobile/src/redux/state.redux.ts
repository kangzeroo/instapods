import { createStore } from 'redux'
import { IDropStorageItem, IDropFunctionality } from '../types.any'
import { PrivateUser } from '../generated-types'
import {
    TOGGLE_BOTTOM_BAR_VISIBLE,
    CHOOSE_POD,
    CHOOSE_DROP,
    SET_USER_PARAMS,
    TOGGLE_UPLOADING_DROP,
    SET_CONFIRMATION_RESULTS,
    TOGGLE_FORCE_ONBOARDING,
    SET_CURRENT_ROUTE,
    SET_NOTIFICATION_BAR_MESSAGE,
    SET_INVITATION_PARAMS,
    SET_UPLOADING_DROP_POD_IDS,
    SET_DROP_STORAGE_ARRAY,
    SET_DROP_FUNCTIONALITY,
    TOGGLE_REFETCH_ON_NOTIFICATION,
    ADD_LOADING_ENGAGEMENT_DROP,
    REMOVE_LOADING_ENGAGEMENT_DROP,
} from './actions.redux'

export interface INewDropNotification {
    message: string
    dropId: string
}

export interface IReduxState {
    bottomBarVisible: boolean
    currentPod: string
    currentDrop: string
    userParams: PrivateUser
    forceOnboarding: boolean
    currentRoute: string
    refetchOnNotification: boolean
    invitationParams: any
    uploadingDrop: {
        loading: boolean
        podIds: Array<string>
        error: boolean
        success: boolean
    }
    loadingEngagementDrop: Array<string>
    // TODO: import type from node_modules
    confirmationResult: any
    storageDropArray: Array<IDropStorageItem>
    newDropNotificationBar?: INewDropNotification | null
    dropFunctionality: IDropFunctionality
}

const DEFAULT_USER_PARAMS: PrivateUser = {
    id: '',
    username: '',
    image: [],
    isPublic: false,
    isOnline: false,
    isVerified: false,
    verificationCode: '',
    karma: 100, // duplicated in backend
    drops: [],
    onboardingSchedule: {},
}

const DEFAULT_INVITATION_PARAMS: any = {
    podId: '',
}

const ReduxState = {
    bottomBarVisible: true,
    currentPod: '',
    currentDrop: '',
    forceOnboarding: false,
    userParams: DEFAULT_USER_PARAMS,
    uploadingDrop: {
        loading: false,
        podIds: [],
        error: false,
        success: false,
    },
    loadingEngagementDrop: [],
    storageDropArray: [],
    currentRoute: '',
    invitationParams: DEFAULT_INVITATION_PARAMS,
    confirmationResult: null,
    newDropNotificationBar: null,
    refetchOnNotification: false,
    dropFunctionality: {
        visible: false,
        drop: null,
        type: null,
    },
}

export type TReduxActionPayload = any

export type TReduxAction = {
    type: string
    payload?: TReduxActionPayload
}

const reducer = (state: IReduxState = ReduxState, action: TReduxAction) => {
    switch (action.type) {
        case TOGGLE_BOTTOM_BAR_VISIBLE:
            return {
                ...state,
                bottomBarVisible: action.payload,
            }
        case CHOOSE_POD:
            return {
                ...state,
                currentPod: action.payload,
            }
        case CHOOSE_DROP:
            return {
                ...state,
                currentDrop: action.payload,
            }
        case SET_USER_PARAMS:
            return {
                ...state,
                userParams: action.payload,
            }
        case SET_DROP_STORAGE_ARRAY:
            // sets drop array (loaded from AsyncStorage in initial-loading-page)
            return {
                ...state,
                storageDropArray: action.payload,
            }
        case SET_INVITATION_PARAMS:
            return {
                ...state,
                invitationParams: action.payload,
            }
        case SET_CONFIRMATION_RESULTS:
            return {
                ...state,
                confirmationResult: action.payload,
            }
        case TOGGLE_UPLOADING_DROP:
            return {
                ...state,
                uploadingDrop: {
                    ...state.uploadingDrop,
                    ...action.payload,
                },
            }
        case TOGGLE_REFETCH_ON_NOTIFICATION:
            return {
                ...state,
                refetchOnNotification: action.payload,
            }
        case SET_DROP_FUNCTIONALITY: {
            return {
                ...state,
                dropFunctionality: action.payload,
            }
        }
        case SET_UPLOADING_DROP_POD_IDS:
            return {
                ...state,
                uploadingDrop: {
                    ...state.uploadingDrop,
                    podIds: action.payload,
                },
            }
        case TOGGLE_FORCE_ONBOARDING:
            return {
                ...state,
                forceOnboarding: action.payload,
            }
        case SET_CURRENT_ROUTE:
            return {
                ...state,
                currentRoute: action.payload,
            }
        case SET_NOTIFICATION_BAR_MESSAGE:
            return {
                ...state,
                newDropNotificationBar: action.payload,
            }
        case ADD_LOADING_ENGAGEMENT_DROP:
            return {
                ...state,
                loadingEngagementDrop: state.loadingEngagementDrop.concat([
                    action.payload,
                ]),
            }
        case REMOVE_LOADING_ENGAGEMENT_DROP:
            return {
                ...state,
                loadingEngagementDrop: state.loadingEngagementDrop.filter(
                    f => f !== action.payload
                ),
            }
        default:
            return state
    }
}

export const store = createStore(reducer)
