import AsyncStorage from '@react-native-community/async-storage'
import { DROP_INTERACTION_LOCAL_STORAGE } from '../../common/constants'
import { IDropStorageItem } from '../../types.any'

const returnDropCompletionName = (userId: string) => {
    return `${DROP_INTERACTION_LOCAL_STORAGE}-${userId}`
}

/**
 * gets the completed drop data from async storage
 */
export const getDropsFromStorage = async (userId: string) => {
    const storedData: string =
        (await AsyncStorage.getItem(returnDropCompletionName(userId))) || '[]'

    let parsedData: Array<IDropStorageItem> = []
    try {
        parsedData = JSON.parse(storedData)
        return parsedData
    } catch {
        return []
    }
}

export const setDropsToStorage = async (
    dropList: Array<IDropStorageItem>,
    userId: string
) => {
    return AsyncStorage.setItem(
        returnDropCompletionName(userId),
        JSON.stringify(dropList)
    )
}

/**
 *
 * @param dropId
 * @param interactionType
 * @param dropList
 */
export const isInteractionType = (
    dropId: string,
    interactionTypes: Array<string>,
    dropList: Array<IDropStorageItem>
) => {
    // return true/false if drop entry has interactionType
    // returns false if the dropId is not in dropList
    return (
        dropList.filter(
            (f: IDropStorageItem) =>
                interactionTypes.indexOf(f.interactionType) > -1 &&
                f.dropId === dropId
        ).length > 0
    )
}
