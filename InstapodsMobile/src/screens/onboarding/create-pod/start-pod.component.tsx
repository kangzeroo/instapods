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
    step: {
        marginTop: 50,
        marginBottom: 10,
    },
    paragraph: {
        fontSize: 20,
        fontWeight: '500',
        color: COLORS.BLACK['500'],
        lineHeight: 25,
        marginTop: 20,
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
        flex: 1,
    },
    imageDemo: {
        width: 300,
        height: 300,
        marginTop: 50,
        alignSelf: 'center',
    },
})

type Props = { navigation: IReactNavigationPlug }
const StartPodOnboarding = ({ navigation }: Props) => {
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
        onboardingSchedule.newPodLesson &&
        !forceOnboarding
    ) {
        navigation.navigate(ROUTES.CREATEPOD_SCREEN)
    }
    return (
        <SafeAreaView style={Styles.safearea}>
            <Divider />
            <ScrollView>
                <Layout style={Styles.layout}>
                    <Text category="h1">Start an Instapod</Text>
                    <Text category="h6" style={Styles.step}>
                        Step 1 - Pick a Niche
                    </Text>
                    <Text style={Styles.paragraph}>
                        {`Growing on Instagram means growing within a niche. A loyal audience.`}
                    </Text>
                    <Text style={Styles.paragraph}>
                        {`Having lots of followers is useless if they don't care about what you have to say.`}
                    </Text>
                    <Text style={Styles.paragraph}>
                        {`Influence is quality over quantity.`}
                    </Text>
                </Layout>
            </ScrollView>
            <View style={Styles.buttonBar}>
                <Button
                    onPress={() =>
                        navigation.navigate(ROUTES.POD_ONBOARDING.INVITE_PEERS)
                    }
                    size="large"
                    style={Styles.next}
                >
                    Understood
                </Button>
            </View>
        </SafeAreaView>
    )
}

export default StartPodOnboarding
