import { Drop_Fragment } from './generated-types'

export interface IReactNavigationPlug {
    [key: string]: any
}

export type IImageCompatibilityPlug = any

export interface IDropStorageItem {
    dropId: string
    dateCreated: number
    interactionType: string
    // [key: string]: string & number
}

export interface IDropFunctionality {
    visible: boolean
    drop: Drop_Fragment | null
    type: string | null // MARKED_COMPLETE or DECLINE
}

export interface INavIconElement {
    icon: string
    text: string
    disabled: boolean
    onPress?: () => void
}

export interface IGrided_Drop_Fragment extends Drop_Fragment {
    gridId: string
}

export interface ILoadingTile {
    gridId: string
}

export interface IFirebaseTimeStampe {
    _seconds: number
    _nanoseconds: number
}
