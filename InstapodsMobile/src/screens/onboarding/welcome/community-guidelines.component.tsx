import React, { useState } from 'react'
import { StyleSheet, View, Linking, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import notifee from '@notifee/react-native'
import { useMutation } from '@apollo/react-hooks'
import { Text, Divider, Layout, Button, CheckBox } from '@ui-kitten/components'
import messaging from '@react-native-firebase/messaging'
import { IReactNavigationPlug } from '../../../types.any'
import { COLORS } from '../../../styles'
import { ROUTES, TERMS_AND_CONDITIONS_URL } from '../../../common/constants'
import { UPDATE_FCM_TOKEN } from './verify-your-account.gql'
import { MutationUpdateUserPushNotificationTokenArgs } from '../../../generated-types'

const Styles = StyleSheet.create({
    safearea: {
        flex: 1,
        backgroundColor: COLORS.WHITE['100'],
    },
    layout: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        textAlign: 'left',
        paddingTop: 50,
        paddingHorizontal: 30,
    },
    paragraph: {
        marginTop: 30,
        fontSize: 20,
        fontWeight: '500',
        color: COLORS.BLACK['500'],
        lineHeight: 25,
    },
    buttonBar: {
        flexDirection: 'column',
        padding: 20,
    },
    next: {
        width: '100%',
        marginTop: 20,
    },
    checkrow: {
        marginBottom: 20,
        marginLeft: 10,
        display: 'flex',
        flexDirection: 'row',
    },
    checkbox: {
        fontSize: 20,
        color: COLORS.BLACK['500'],
    },
    toc: {
        fontSize: 20,
        lineHeight: 25,
        fontWeight: '500',
        color: COLORS.BLUE['500'],
    },
})

type Props = { navigation: IReactNavigationPlug }
const RulesOfEngagement = ({ navigation }: Props) => {
    const [agreedToFcm, setAgreedToFcm] = useState(false)
    const [agreedToToc, setAgreedToToc] = useState(false)
    const [updateUserPushNotificationToken] = useMutation(UPDATE_FCM_TOKEN)
    const enableNotifications = async () => {
        const current = agreedToFcm
        setAgreedToFcm(!agreedToFcm)
        if (!current) {
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
    }
    const agreeToTerms = () => {
        setAgreedToToc(!agreedToToc)
    }
    const openTOC = () => {
        Linking.openURL(
            `${TERMS_AND_CONDITIONS_URL}?utm_source=app-welcome-onboarding-page`
        )
    }
    return (
        <SafeAreaView style={Styles.safearea}>
            <ScrollView>
                <Divider />
                <Layout style={Styles.layout}>
                    <Text category="h1">COMMUNITY GUIDELINES</Text>
                    <Text style={Styles.paragraph}>
                        {`Success with Instapods depends active participation in a timely manner.`}
                    </Text>
                    <Text style={Styles.paragraph}>
                        {`It is the responsibility of Pod Members to keep the Pod "healthy".`}
                    </Text>
                    <Text style={Styles.paragraph}>
                        {`To use the app, you must agree not to use bots and only invite Pod Members who are relevant to your niche.`}
                    </Text>
                </Layout>
            </ScrollView>

            <View style={Styles.buttonBar}>
                <View style={Styles.checkrow}>
                    <CheckBox
                        text="I agree to"
                        checked={agreedToToc}
                        onChange={agreeToTerms}
                        textStyle={Styles.checkbox}
                    />
                    <Text onPress={openTOC} style={Styles.toc}>
                        Terms & Conditions
                    </Text>
                </View>
                <View style={Styles.checkrow}>
                    <CheckBox
                        text="Enable Push Notifications"
                        checked={agreedToFcm}
                        onChange={enableNotifications}
                        textStyle={Styles.checkbox}
                    />
                </View>
                <Button
                    onPress={() =>
                        navigation.navigate(
                            ROUTES.WELCOME_ONBOARDING.VERIFY_ACCOUNT
                        )
                    }
                    style={Styles.next}
                    // disabled={!agreedToFcm || !agreedToToc}
                    disabled={!agreedToToc}
                >
                    Next
                </Button>
            </View>
        </SafeAreaView>
    )
}

export default RulesOfEngagement
