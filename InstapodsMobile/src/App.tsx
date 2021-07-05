/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the UI Kitten TypeScript template
 * https://github.com/akveo/react-native-ui-kitten
 *
 * Documentation: https://akveo.github.io/react-native-ui-kitten/docs
 *
 * @format
 */

import React, { useEffect } from 'react'
import ApolloClient from 'apollo-boost'
// import notifee from '@notifee/react-native'
import { ApolloProvider } from '@apollo/react-hooks'
// import messaging from '@react-native-firebase/messaging'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import { mapping, light as theme } from '@eva-design/eva'
import { Provider as ReduxProvider } from 'react-redux'
// import dynamicLinks from '@react-native-firebase/dynamic-links'
// import AsyncStorage from '@react-native-community/async-storage'
import auth from '@react-native-firebase/auth'
import SplashScreen from 'react-native-splash-screen'
//@ts-ignore
import Smartlook from 'smartlook-react-native-wrapper'
import { Provider as AntdProvider } from '@ant-design/react-native'
import analytics from '@react-native-firebase/analytics'
// import { navigate } from './navigators/navigation.ref'
import { store } from './redux'
import AppNavigator from './Routes'
// import { getParameterByName } from './common/utils'
import { GRAPHQL_ENDPOINT, SMARTLOOK_API_KEY } from './common/constants'

// notifee.onBackgroundEvent(async ({ type, detail }) => {
//     console.log('--- notifee.onBackgroundEvent')
//     console.log(detail)
// })

const App = (): React.ReactFragment => {
    const client = new ApolloClient({
        uri: GRAPHQL_ENDPOINT,
        request: async operation => {
            const token = await auth().currentUser?.getIdToken()
            // console.log(token)
            operation.setContext({
                headers: {
                    authorization: token ? `Bearer ${token}` : '',
                },
            })
        },
    })

    // const onBackgroundStateOpenMessage = async (message: any) => {
    //     console.log('---- onBackgroundStateOpenMessage: ', message)
    //     // navigate(ROUTES.PREVIEW_DROP, {
    //     //     dropId: message.data.dropId,
    //     // })
    // }

    useEffect(() => {
        SplashScreen.hide()
        Smartlook.setupAndStartRecording(SMARTLOOK_API_KEY)
    })

    // useEffect(() => {
    //     messaging().setBackgroundMessageHandler(onBackgroundStateOpenMessage)
    //     notifee.onBackgroundEvent(async ({ type, detail }) => {
    //         console.log('type... ', type)
    //         console.log('detail... ', detail)
    //     })
    // })

    // const initialDynamicLink = async () => {
    //     const link = await dynamicLinks().getInitialLink()
    //     console.log(link)
    //     if (link) {
    //         const podId = getParameterByName('pod', link.url)
    //         // TODO: use asyncstorage for now until we have a better solution
    //         // @ts-ignore
    //         await AsyncStorage.setItem('podId', podId)
    //     }
    // }

    // const goToInitialDynamicLink = async () => {
    //     const podId = await AsyncStorage.getItem('podId')
    //     console.log('goToInitialDynamicLink')
    //     await AsyncStorage.setItem('podId', '')
    //     if (podId) {
    //         navigate(ROUTES.JOIN_POD, { podId })
    //     }
    // }

    useEffect(() => {
        // initialDynamicLink()
        auth().onAuthStateChanged(userAccount => {
            if (userAccount) {
                analytics().setUserId(userAccount.uid)
                setTimeout(() => {
                    // goToInitialDynamicLink()
                }, 500)
            }
            if (!userAccount) {
                setTimeout(() => {
                    client.resetStore()
                }, 1000)
            }
        })
        // console.log('Waiting on fcm message...')
        // console.log('WEB_CLIENT_ID: ', WEB_CLIENT_ID)
    })
    return (
        <>
            <ApolloProvider client={client}>
                <ReduxProvider store={store}>
                    <AntdProvider>
                        <IconRegistry icons={EvaIconsPack} />
                        <ApplicationProvider mapping={mapping} theme={theme}>
                            <AppNavigator />
                        </ApplicationProvider>
                    </AntdProvider>
                </ReduxProvider>
            </ApolloProvider>
        </>
    )
}

export default App
