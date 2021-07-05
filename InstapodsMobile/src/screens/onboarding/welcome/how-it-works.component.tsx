import React from 'react'
import { StyleSheet, View, Linking, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { Text, Divider, Layout, Button } from '@ui-kitten/components'
import { IReactNavigationPlug } from '../../../types.any'
import { COLORS } from '../../../styles'
import { ROUTES, LEARN_MORE_HOW_IT_WORKS_URL } from '../../../common/constants'

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
        marginTop: 30,
    },
})

type Props = { navigation: IReactNavigationPlug }
const HowItWorks = ({ navigation }: Props) => {
    const openTOC = () => {
        Linking.openURL(
            `${LEARN_MORE_HOW_IT_WORKS_URL}?utm_source=app-welcome-onboarding`
        )
    }
    return (
        <SafeAreaView style={Styles.safearea}>
            <ScrollView>
                <Divider />
                <Layout style={Styles.layout}>
                    <Text category="h1">HOW IT WORKS</Text>
                    <Text style={Styles.paragraph}>
                        {`An Instapod is a group of people in the same niche, commenting on each other's IG posts in a timely manner.`}
                    </Text>
                    <Text style={Styles.paragraph}>
                        {`The IG Algorithm will reward you by showing your content to more people in your shared audience network.`}
                    </Text>
                    <Text style={Styles.paragraph}>
                        {`The Instapods App™ keeps Pods sane by automatically checking engagement, to ensure that Pod Members are contributing fairly.`}
                    </Text>
                    <Text onPress={openTOC} style={Styles.toc}>
                        Guide to Beating the Algorithm
                    </Text>
                </Layout>
            </ScrollView>

            <View style={Styles.buttonBar}>
                <Button
                    onPress={() =>
                        navigation.navigate(
                            ROUTES.WELCOME_ONBOARDING.RULES_OF_ENGAGEMENT
                        )
                    }
                    style={Styles.next}
                >
                    Continue
                </Button>
            </View>
        </SafeAreaView>
    )
}

export default HowItWorks
