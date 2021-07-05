import React from 'react'
import { StyleSheet, View, Linking, ScrollView } from 'react-native'
// import auth from '@react-native-firebase/auth'
import { SafeAreaView } from 'react-navigation'
import { Text, Divider, Layout, Button } from '@ui-kitten/components'
import analytics from '@react-native-firebase/analytics'
import { IReactNavigationPlug } from '../../../types.any'
import { COLORS } from '../../../styles'
import { ROUTES, GETTING_STARTED_GUIDE_URL } from '../../../common/constants'

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
        flexDirection: 'row',
        padding: 20,
    },
    next: {
        width: '100%',
    },
    toc: {
        fontSize: 20,
        lineHeight: 25,
        fontWeight: '500',
        color: COLORS.BLUE['500'],
    },
})

type Props = { navigation: IReactNavigationPlug }
const NextSteps = ({ navigation }: Props) => {
    const openTOC = () => {
        Linking.openURL(
            `${GETTING_STARTED_GUIDE_URL}?utm_source=app-welcome-onboarding-page`
        )
    }
    return (
        <SafeAreaView style={Styles.safearea}>
            <ScrollView>
                <Divider />
                <Layout style={Styles.layout}>
                    <Text category="h1">NEXT STEPS</Text>
                    <Text style={Styles.paragraph}>
                        {`Congrats on setting up your account! We highly encourage you to read the`}
                    </Text>
                    <Text onPress={openTOC} style={Styles.toc}>
                        Getting Started Guide
                    </Text>
                    <Text style={Styles.paragraph}>
                        {`Now go out there and make some new friends!`}
                    </Text>
                </Layout>
            </ScrollView>
            <View style={Styles.buttonBar}>
                <Button
                    onPress={() => {
                        analytics().logTutorialComplete()
                        navigation.navigate(ROUTES.LOGGED_IN_SECTION)
                    }}
                    size="large"
                    style={Styles.next}
                >
                    Begin
                </Button>
            </View>
        </SafeAreaView>
    )
}

export default NextSteps
