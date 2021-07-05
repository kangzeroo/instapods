import React, { useEffect, useState } from 'react'

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { useSelector } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import dynamicLinks, {
    FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links'
import { IReactNavigationPlug } from '../types.any'
import { IReduxState } from '../redux/state.redux'
import { BottomBarNavigator } from '../common/components/bottom-navigation-bar.component'
import { AppLoading } from '../common/components/app-loading.component'
import NotificationBarProvider from '../common/components/notification-bar-provider.component'
import { navigate } from './navigation.ref'
import { getParameterByName } from '../common/utils'
import { ROUTES } from '../common/constants'

const LoggedInSection = ({ navigation }: IReactNavigationPlug) => {
    const [initializing, setInitializing] = useState(true)
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null)

    useEffect(() => {
        const authSub = auth().onAuthStateChanged(userAccount => {
            setUser(userAccount)
            if (initializing) {
                setInitializing(false)
            }
        })
        return authSub
    }, [initializing])

    const handleDynamicLink = async (
        link: FirebaseDynamicLinksTypes.DynamicLink
    ) => {
        if (
            link &&
            link.url.startsWith('https://instapod.page.link/onboarding')
        ) {
            const podId = getParameterByName('pod', link.url)

            // TODO: use asyncstorage for now until we have a better solution
            // @ts-ignore
            await AsyncStorage.setItem('podId', podId)
            navigate(ROUTES.JOIN_POD, { podId })
        }
    }

    useEffect(() => {
        // Background/Quit events: if the application was opened via a link while in background state /has fully quit
        const unsubscribe = dynamicLinks().onLink(handleDynamicLink)

        // When the is component unmounted, remove the listener
        return () => {
            unsubscribe()
        }
    })

    const bottomBarVisible = useSelector(
        (state: IReduxState) => state.bottomBarVisible
    )
    // const reduxState = useSelector((state: IReduxState) => state)

    if (initializing) {
        return <AppLoading />
    }

    if (!user) {
        navigation.navigate(ROUTES.LOGGED_OUT_SECTION)
    }
    return (
        <NotificationBarProvider>
            <BottomBarNavigator bottomBarVisible={bottomBarVisible} />
        </NotificationBarProvider>
    )
}

export default LoggedInSection
