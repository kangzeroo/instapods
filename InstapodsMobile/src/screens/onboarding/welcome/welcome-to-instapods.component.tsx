import React, { useEffect } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import analytics from '@react-native-firebase/analytics'
// import auth from '@react-native-firebase/auth'
import { Text, Divider, Layout, Button } from '@ui-kitten/components'
import { IReactNavigationPlug } from '../../../types.any'
import { COLORS } from '../../../styles'
import { ROUTES } from '../../../common/constants'

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
})

type Props = { navigation: IReactNavigationPlug }
const WelcomeToInstapods = ({ navigation }: Props) => {
    useEffect(() => {
        analytics().logTutorialBegin()
    })
    return (
        <SafeAreaView style={Styles.safearea}>
            <ScrollView>
                <Divider />
                <Layout style={Styles.layout}>
                    <Text category="h1">WELCOME TO INSTAPODS</Text>
                    <Text style={Styles.paragraph}>
                        {`Boost your Instagram reach by trading Like for Likes within your niche.`}
                    </Text>
                    <Text style={Styles.paragraph}>
                        {`Instapods is the fastest & safest way to reach your desired organic audience.`}
                    </Text>
                </Layout>
            </ScrollView>
            <View style={Styles.buttonBar}>
                <Button
                    onPress={() =>
                        navigation.navigate(
                            ROUTES.WELCOME_ONBOARDING.HOW_IT_WORKS
                        )
                    }
                    size="large"
                    style={Styles.next}
                >
                    Get Started
                </Button>
            </View>
        </SafeAreaView>
    )
}

export default WelcomeToInstapods
