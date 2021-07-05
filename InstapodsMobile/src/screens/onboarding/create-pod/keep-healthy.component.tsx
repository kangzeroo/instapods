import React from 'react'
import { StyleSheet, View, Linking } from 'react-native'
// import auth from '@react-native-firebase/auth'
import { SafeAreaView } from 'react-navigation'
import { useMutation } from '@apollo/react-hooks'
import { useDispatch } from 'react-redux'
import { Text, Divider, Layout, Button } from '@ui-kitten/components'
import analytics from '@react-native-firebase/analytics'
import { ScrollView } from 'react-native-gesture-handler'
import { IReactNavigationPlug } from '../../../types.any'
import { COLORS } from '../../../styles'
import { ROUTES, KARMA_SYSTEM_GUIDE_URL } from '../../../common/constants'
import { TOGGLE_FORCE_ONBOARDING } from '../../../redux/actions.redux'
import {
    CREATE_POD_ONBOARDING,
    NEW_POD_LESSON_ONBOARDING_EVENT,
} from './keep-healthy.gql'
import { MutationUpdateOnboardingScheduleArgs } from '../../../generated-types'

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
        marginTop: 50,
        alignSelf: 'center',
    },
    faq: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 20,
        fontWeight: '500',
        color: COLORS.BLUE['500'],
    },
})

type Props = { navigation: IReactNavigationPlug }
const KeepHealthyOnboarding = ({ navigation }: Props) => {
    const [updateOnboarding] = useMutation(CREATE_POD_ONBOARDING)
    const dispatch = useDispatch()
    const mutationArgs: MutationUpdateOnboardingScheduleArgs = {
        onboardingEvent: NEW_POD_LESSON_ONBOARDING_EVENT,
    }
    return (
        <SafeAreaView style={Styles.safearea}>
            <Divider />
            <ScrollView>
                <Layout style={Styles.layout}>
                    <Text category="h6">Step 3</Text>
                    <Text category="h1">Keep your pod healthy</Text>
                    <Text
                        style={Styles.paragraph}
                    >{`Comment on posts as soon as your Pod Members share them.`}</Text>
                    <Text
                        style={Styles.paragraph}
                    >{`The more your Pod Members participate, the healthier your Pod Karma and your Personal Karma. Everyone wins.`}</Text>
                    <Text
                        style={Styles.paragraph}
                    >{`To learn more about how the Karma System works, check out our`}</Text>
                    <Text
                        onPress={() =>
                            Linking.openURL(
                                `${KARMA_SYSTEM_GUIDE_URL}?utm_source=app-pod-onboarding-page`
                            )
                        }
                        style={Styles.faq}
                    >
                        Guide to Karma System
                    </Text>
                </Layout>
            </ScrollView>
            <View style={Styles.buttonBar}>
                <Button
                    onPress={() => {
                        updateOnboarding({
                            variables: mutationArgs,
                            refetchQueries: ['getMyProfile'],
                        })
                        dispatch({
                            type: TOGGLE_FORCE_ONBOARDING,
                            payload: false,
                        })
                        analytics().logTutorialComplete()
                        navigation.navigate(ROUTES.CREATEPOD_SCREEN)
                    }}
                    size="large"
                    style={Styles.next}
                >
                    Get Started
                </Button>
            </View>
        </SafeAreaView>
    )
}

export default KeepHealthyOnboarding
