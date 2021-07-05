import React from 'react'
// import { StyleSheet } from 'react-native'
import { NoticeBar } from '@ant-design/react-native'
import { useDispatch, useSelector } from 'react-redux'
import { ROUTES } from '../constants'
import { IReactNavigationPlug } from '../../types.any'
import { IReduxState, INewDropNotification } from '../../redux/state.redux'
import {
    SET_NOTIFICATION_BAR_MESSAGE,
    TOGGLE_BOTTOM_BAR_VISIBLE,
} from '../../redux/actions.redux'

// const Styles = StyleSheet.create({
//     root: {
//         flex: 1,
//     },
// })

type Props = { navigation: IReactNavigationPlug }
const NotificationBar = ({ navigation }: Props) => {
    const dispatch = useDispatch()
    const newDropNotificationBar:
        | INewDropNotification
        | null
        | undefined = useSelector(
        (state: IReduxState) => state.newDropNotificationBar
    )
    if (!newDropNotificationBar) {
        return null
    }
    const { message, dropId } = newDropNotificationBar
    return (
        <NoticeBar
            onPress={() => {
                navigation.navigate(ROUTES.PREVIEW_DROP, {
                    dropId,
                })
                dispatch({
                    type: SET_NOTIFICATION_BAR_MESSAGE,
                    payload: null,
                })
                dispatch({ type: TOGGLE_BOTTOM_BAR_VISIBLE, payload: false })
            }}
            marqueeProps={{
                loop: true,
                style: { fontSize: 12, color: 'green' },
            }}
            mode="link"
        >
            {message}
        </NoticeBar>
    )
}

export default NotificationBar
