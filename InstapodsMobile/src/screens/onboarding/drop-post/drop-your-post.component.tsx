import React from 'react'
import { StyleSheet, View } from 'react-native'
// import auth from '@react-native-firebase/auth'
import { SafeAreaView } from 'react-navigation'
import { useMutation } from '@apollo/react-hooks'
import { Text, Divider, Layout, Button } from '@ui-kitten/components'
import { useDispatch } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler'
import analytics from '@react-native-firebase/analytics'
import { TOGGLE_FORCE_ONBOARDING } from '../../../redux/actions.redux'
import { IReactNavigationPlug } from '../../../types.any'
import { COLORS } from '../../../styles'
import { ROUTES } from '../../../common/constants'
import {
    DROP_POST_ONBOARDING,
    NEW_DROP_LESSON_ONBOARDING_EVENT,
} from './drop-your-post.gql'
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
        minWidth: '100%',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
    },
    imageDemo: {
        width: 150,
        height: 150,
        marginTop: 50,
        alignSelf: 'center',
    },
    imageText: {
        color: COLORS.BLACK['400'],
        width: '50%',
        textAlign: 'center',
        marginTop: 20,
        alignSelf: 'center',
    },
})

type Props = { navigation: IReactNavigationPlug }
const DropYourPostOnboarding = ({ navigation }: Props) => {
    const dispatch = useDispatch()
    const [updateOnboarding] = useMutation(DROP_POST_ONBOARDING)
    const mutationArgs: MutationUpdateOnboardingScheduleArgs = {
        onboardingEvent: NEW_DROP_LESSON_ONBOARDING_EVENT,
    }
    return (
        <SafeAreaView style={Styles.safearea}>
            <Divider />
            <ScrollView>
                <Layout style={Styles.layout}>
                    <Text category="h6">Step 3</Text>
                    <Text category="h1">Drop your post</Text>
                    <Text style={Styles.paragraph}>
                        {`Share your post when you're ready. All Pod Members will get a notification prompting them to comment on it.`}
                    </Text>
                    <Text style={Styles.paragraph}>
                        {`This rapid and relevant engagement is what boosts your post to a wider audience.`}
                    </Text>
                    {/* <View style={Styles.imageBar}>
                        <Image
                            source={[
                                {
                                    height: 250,
                                    width: 250,
                                    uri:
                                        'https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/base_assets%2Fpublic%2Fstopwatch-icon.png?alt=media&token=68dd0db5-fa6e-41f7-bd39-c811e55ec657',
                                },
                            ]}
                            style={Styles.imageDemo}
                        />
                        <Text style={Styles.imageText}>
                            Be sure to check the pod descriptions to see the
                            best times to drop.
                        </Text>
                    </View> */}
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
                        navigation.navigate(ROUTES.NEW_DROP)
                    }}
                    size="large"
                    style={Styles.next}
                >
                    {`Understood`}
                </Button>
            </View>
        </SafeAreaView>
    )
}

export default DropYourPostOnboarding
