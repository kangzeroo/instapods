import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import messaging from '@react-native-firebase/messaging'
import { useMutation } from '@apollo/react-hooks'
import { navigate } from '../../navigators/navigation.ref'
import { ROUTES } from '../constants'
import {
    SET_NOTIFICATION_BAR_MESSAGE,
    TOGGLE_REFETCH_ON_NOTIFICATION,
    TOGGLE_BOTTOM_BAR_VISIBLE,
} from '../../redux/actions.redux'
import { INewDropNotification, IReduxState } from '../../redux/state.redux'
import { UPDATE_FCM_TOKEN } from '../../screens/onboarding/welcome/verify-your-account.gql'
import { MutationUpdateUserPushNotificationTokenArgs } from '../../generated-types'

const Styles = StyleSheet.create({
    root: {
        flex: 1,
    },
})

const NotificationBarProvider = ({ children }: { children: any }) => {
    const dispatch = useDispatch()
    const [updateUserPushNotificationToken] = useMutation(UPDATE_FCM_TOKEN)
    const refetchOnNotification: boolean = useSelector(
        (state: IReduxState) => state.refetchOnNotification
    )
    const emergancyLog = (origin: string, data: any) => {
        axios
            .post(
                'https://us-central1-the-instapods-app---prod.cloudfunctions.net/logging',
                { origin, data }
            )
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }
    const toggleRefetch = () => {
        // below will refetch pod list and pod view page....
        if (!refetchOnNotification) {
            console.log('toggle refetch')
            dispatch({
                type: TOGGLE_REFETCH_ON_NOTIFICATION,
                payload: true,
            })
            setTimeout(() => {
                dispatch({
                    type: TOGGLE_REFETCH_ON_NOTIFICATION,
                    payload: false,
                })
            }, 1000)
        }
    }
    const onForegroundStateMessage = async (message: any) => {
        // eslint-disable-next-line no-console
        console.log('---- onForegroundStateMessage: ', message)
        emergancyLog('onForegroundStateMessage', message)
        if (message) {
            const noticeBar: INewDropNotification = {
                message: message.data.title,
                dropId: message.data.dropId,
            }
            dispatch({
                type: SET_NOTIFICATION_BAR_MESSAGE,
                payload: noticeBar,
            })
            toggleRefetch()
        }
    }
    const onBackgroundStateOpenMessage = async (message: any) => {
        console.log('---- onBackgroundStateOpenMessage: ', message)
        if (message) {
            emergancyLog('onBackgroundStateOpenMessage', message)
            navigate(ROUTES.PREVIEW_DROP, {
                dropId: message.data.dropId,
            })
            dispatch({ type: TOGGLE_BOTTOM_BAR_VISIBLE, payload: false })
            toggleRefetch()
        }
    }
    const onQuitStateOpenMessage = async (message: any) => {
        console.log('---- onQuitStateOpenMessage: ', message)
        if (message) {
            emergancyLog('onQuitStateOpenMessage', message)
            navigate(ROUTES.PREVIEW_DROP, {
                dropId: message.data.dropId,
            })
            dispatch({ type: TOGGLE_BOTTOM_BAR_VISIBLE, payload: false })
        }
    }
    useEffect(() => {
        messaging().onMessage(onForegroundStateMessage)
        messaging().onTokenRefresh(token => {
            const mutationArgs: MutationUpdateUserPushNotificationTokenArgs = {
                token,
            }
            updateUserPushNotificationToken({
                variables: mutationArgs,
                refetchQueries: ['getMyProfile'],
            })
        })
        messaging().onNotificationOpenedApp(onBackgroundStateOpenMessage)
        messaging()
            .getInitialNotification()
            .then(onQuitStateOpenMessage)
            .catch(() => {})
    })
    return <View style={Styles.root}>{children}</View>
}

export default NotificationBarProvider
