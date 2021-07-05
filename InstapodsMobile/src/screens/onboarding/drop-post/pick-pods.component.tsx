import React from 'react'
import { StyleSheet, View } from 'react-native'
// import auth from '@react-native-firebase/auth'
import { SafeAreaView } from 'react-navigation'
import { ScrollView } from 'react-native-gesture-handler'
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
const PickPodsOnboarding = ({ navigation }: Props) => {
    return (
        <SafeAreaView style={Styles.safearea}>
            <Divider />
            <ScrollView>
                <Layout style={Styles.layout}>
                    <Text category="h6">Step 2</Text>
                    <Text category="h1">Pick your pods</Text>
                    <Text style={Styles.paragraph}>
                        {`Select the Pods that fit your niche. You can drop a post into multiple Pods.`}
                    </Text>
                    <Text style={Styles.paragraph}>
                        {`If you haven't joined any Pods, you won't be able to drop a post.`}
                    </Text>
                    {/* <View style={Styles.imageBar}>
                        <Image
                            source={[
                                {
                                    height: 200,
                                    width: 200,
                                    uri:
                                        'https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2Fdrop-onboarding-step2.png?alt=media&token=2f09c445-d561-4e2e-bb3f-3501db4351e5',
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
                        navigation.navigate(ROUTES.DROP_ONBOARDING.DROP_POSTS)
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

export default PickPodsOnboarding
