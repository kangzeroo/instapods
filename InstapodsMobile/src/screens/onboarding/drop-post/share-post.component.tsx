import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
// import auth from '@react-native-firebase/auth'
import { SafeAreaView } from 'react-navigation'
import { useSelector } from 'react-redux'
import { Text, Divider, Layout, Button } from '@ui-kitten/components'
import analytics from '@react-native-firebase/analytics'
import { ScrollView } from 'react-native-gesture-handler'
import { IReactNavigationPlug } from '../../../types.any'
import { COLORS } from '../../../styles'
import { ROUTES } from '../../../common/constants'
import { IReduxState } from '../../../redux/state.redux'

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
        marginTop: 20,
        fontSize: 20,
        fontWeight: '500',
        color: COLORS.BLACK['500'],
        lineHeight: 25,
    },
    buttonBar: {
        flexDirection: 'row',
        padding: 20,
    },
    next: {
        width: '100%',
    },
    imageBar: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
    },
    imageDemo: {
        width: 300,
        height: 300,
        marginTop: 100,
        alignSelf: 'center',
    },
})

type Props = { navigation: IReactNavigationPlug }
const SharePostOnboarding = ({ navigation }: Props) => {
    useEffect(() => {
        analytics().logTutorialBegin()
    })
    const { onboardingSchedule, forceOnboarding } = useSelector(
        (state: IReduxState) => ({
            onboardingSchedule: state.userParams.onboardingSchedule,
            forceOnboarding: state.forceOnboarding,
        })
    )
    if (
        onboardingSchedule &&
        // onboardingSchedule.newPodLesson &&
        onboardingSchedule.newDropLesson &&
        !forceOnboarding
    ) {
        navigation.navigate(ROUTES.NEW_DROP)
    }
    return (
        <SafeAreaView style={Styles.safearea}>
            <Divider />
            <ScrollView>
                <Layout style={Styles.layout}>
                    <Text category="h6">Step 1</Text>
                    <Text category="h1">Share a post</Text>
                    <Text style={Styles.paragraph}>
                        {`Go to your Instagram post and copy the share link to your clipboard.`}
                    </Text>
                    {/* <View style={Styles.imageBar}>
                        <Image
                            source={[
                                {
                                    height: 250,
                                    width: 250,
                                    uri:
                                        'https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2Fdrop-onboarding-step1.png?alt=media&token=0df96c3a-81e4-498e-9042-b633982213ed',
                                },
                            ]}
                            style={Styles.imageDemo}
                        />
                    </View> */}
                </Layout>
            </ScrollView>
            <View style={Styles.buttonBar}>
                <Button
                    onPress={() =>
                        navigation.navigate(ROUTES.DROP_ONBOARDING.PICK_PODS)
                    }
                    size="large"
                    style={Styles.next}
                >
                    Continue
                </Button>
            </View>
        </SafeAreaView>
    )
}

export default SharePostOnboarding
