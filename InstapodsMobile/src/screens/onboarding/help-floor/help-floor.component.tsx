import React from 'react'
import { StyleSheet, Linking, View } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { ScrollView } from 'react-native-gesture-handler'
import messaging from '@react-native-firebase/messaging'
import notifee from '@notifee/react-native'
import { useMutation } from '@apollo/react-hooks'
import {
    Text,
    Layout,
    Icon,
    TopNavigation,
    TopNavigationAction,
    Card,
} from '@ui-kitten/components'
import { IReactNavigationPlug } from '../../../types.any'
import {
    BEATING_THE_ALGO_URL,
    GETTING_STARTED_GUIDE_URL,
    HOW_TO_FIND_PODS_URL,
    KARMA_SYSTEM_GUIDE_URL,
    FAQ_URL,
    IG_URL,
} from '../../../common/constants'
import { COLORS } from '../../../common/styles'
import { UPDATE_FCM_TOKEN } from '../welcome/verify-your-account.gql'
import { MutationUpdateUserPushNotificationTokenArgs } from '../../../generated-types'

const Styles = StyleSheet.create({
    safearea: {
        flex: 1,
        backgroundColor: COLORS.WHITE['100'],
    },
    layout: {
        flex: 1,
        padding: 10,
    },
    cardWrapper: {
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginVertical: 10,
    },
    card: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    title: {
        paddingLeft: 20,
        paddingVertical: 10,
    },
    requestPushPermissions: {
        marginTop: 30,
    },
})

type Props = { navigation: IReactNavigationPlug }
type THelpGuide = {
    id: string
    title: string
    description: string
    url: string
}
const HelpFloorScreen = ({ navigation }: Props) => {
    const [updateUserPushNotificationToken] = useMutation(UPDATE_FCM_TOKEN)
    const BackIcon = (style: object) => <Icon {...style} name="arrow-back" />
    const helpGuides: Array<THelpGuide> = [
        {
            id: GETTING_STARTED_GUIDE_URL,
            title: '✅   Getting Started',
            description:
                'The 3 minute quickstart to success with Instapods. Read this if you want the quick how-to.',
            url: `${GETTING_STARTED_GUIDE_URL}?utm_source=app-helpfloor-page`,
        },
        {
            id: BEATING_THE_ALGO_URL,
            title: '📈   Beating the Algorithm',
            description:
                'An in-depth guide on how Instapods help you ride the IG algorithm and techniques for fast growth.',
            url: `${BEATING_THE_ALGO_URL}?utm_source=app-helpfloor-page`,
        },
        {
            id: HOW_TO_FIND_PODS_URL,
            title: '🔍   How to find Pods',
            description:
                'A step by step guide on how to find the right Pods for each stage of growth of your account.',
            url: `${HOW_TO_FIND_PODS_URL}?utm_source=app-helpfloor-page`,
        },
        {
            id: KARMA_SYSTEM_GUIDE_URL,
            title: '💝   Guide to the Karma System',
            description:
                'An explanation of what Karma is, why its useful, and examples of its benefits.',
            url: `${KARMA_SYSTEM_GUIDE_URL}?utm_source=app-helpfloor-page`,
        },
        {
            id: FAQ_URL,
            title: '🤔   Myths & FAQ',
            description:
                'The most common questions and misconceptions about Pods, debunked & answered.',
            url: `${FAQ_URL}?utm_source=app-helpfloor-page`,
        },
        {
            id: IG_URL,
            title: '🎉   Follow us on Instagram',
            description:
                'Follow us on Instagram for the latest updates, or message us directly.',
            url: IG_URL,
        },
    ]
    const enableNotifications = async () => {
        await messaging().registerDeviceForRemoteMessages()
        try {
            const token = await messaging().getToken()
            const mutationArgs: MutationUpdateUserPushNotificationTokenArgs = {
                token,
            }
            updateUserPushNotificationToken({
                variables: mutationArgs,
                refetchQueries: ['getMyProfile'],
            })
            await notifee.requestPermission({
                sound: true,
                announcement: true,
            })
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e)
        }
    }
    return (
        <SafeAreaView style={Styles.safearea}>
            <TopNavigation
                title="Help Guides"
                alignment="center"
                leftControl={
                    <TopNavigationAction
                        icon={BackIcon}
                        onPress={() => navigation.goBack()}
                    />
                }
            />
            <ScrollView>
                <Layout style={Styles.layout}>
                    {helpGuides.map((guide: THelpGuide) => (
                        <View key={guide.id} style={Styles.cardWrapper}>
                            <Card
                                style={Styles.card}
                                onPress={() => Linking.openURL(guide.url)}
                                header={() => (
                                    <View style={Styles.title}>
                                        <Text category="h6">{guide.title}</Text>
                                    </View>
                                )}
                            >
                                <Text>{guide.description}</Text>
                            </Card>
                        </View>
                    ))}
                    <Text
                        style={Styles.requestPushPermissions}
                        onPress={enableNotifications}
                    >
                        Request Push Notifications
                    </Text>
                </Layout>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HelpFloorScreen
