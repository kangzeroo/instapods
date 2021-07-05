import React from 'react'
import { StyleSheet, View } from 'react-native'
// import auth from '@react-native-firebase/auth'
import { SafeAreaView } from 'react-navigation'
import { Text, Divider, Layout, Button } from '@ui-kitten/components'
import { ScrollView } from 'react-native-gesture-handler'
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
})

type Props = { navigation: IReactNavigationPlug }
const InvitePeersOnboarding = ({ navigation }: Props) => {
    return (
        <SafeAreaView style={Styles.safearea}>
            <Divider />
            <ScrollView>
                <Layout style={Styles.layout}>
                    <Text category="h6">Step 2</Text>
                    <Text category="h1">Invite your peers</Text>
                    <Text style={Styles.paragraph}>
                        {`Remember that all Pod Members must be in your same niche.`}
                    </Text>
                    <Text style={Styles.paragraph}>
                        {`Inviting randoms won't help. Pod Members eventually share each other's audience, so keep it relevant.`}
                    </Text>
                    <Text style={Styles.paragraph}>
                        {`We're building real communities here.`}
                    </Text>
                </Layout>
            </ScrollView>
            <View style={Styles.buttonBar}>
                <Button
                    onPress={() =>
                        navigation.navigate(ROUTES.POD_ONBOARDING.KEEP_HEALTHY)
                    }
                    size="large"
                    style={Styles.next}
                >
                    Next
                </Button>
            </View>
        </SafeAreaView>
    )
}

export default InvitePeersOnboarding
