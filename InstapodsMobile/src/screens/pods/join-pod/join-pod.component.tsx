import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { useRoute } from '@react-navigation/native'
import { Button, Divider, Layout, Text } from '@ui-kitten/components'
import LottieView from 'lottie-react-native'

import { useQuery, useMutation } from '@apollo/react-hooks'
import { IReactNavigationPlug } from '../../../types.any'
import {
    QueryGetPodDetailsAsInviteeArgs,
    MutationJoinPodArgs,
} from '../../../generated-types'
import { JOIN_POD, GET_POD_AS_INVITEE } from './join-pod.gql'
import { ROUTES } from '../../../common/constants'
import { AppLoading } from '../../../common/components/app-loading.component'
import { Header } from '../../../common/components/header.component'
import { INVITATION_ANIMATION } from '../../../lottie-animations'
import { COLORS } from '../../../common/styles'

type Props = { navigation: IReactNavigationPlug }
const JoinPodScreen = ({ navigation }: Props) => {
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const route: any = useRoute()
    const podId = route?.params?.podId || ''
    const queryArgsGetPodAsInvitee: QueryGetPodDetailsAsInviteeArgs = { podId }

    const {
        loading: getPodAsInviteeLoading,
        error: getPodAsInviteeError,
        data: getPodAsInviteeData,
    } = useQuery(GET_POD_AS_INVITEE, {
        variables: queryArgsGetPodAsInvitee,
    })
    const [
        joinPod,
        { loading: joinPodLoading, error: joinPodError },
    ] = useMutation(JOIN_POD)

    useEffect(() => {
        setErrorMessage(
            (
                joinPodError?.message ||
                getPodAsInviteeError?.message ||
                ''
            )?.replace('GraphQL error: ', '')
        )
    }, [joinPodError, getPodAsInviteeError])

    if (joinPodLoading) {
        return <AppLoading />
    }
    if (errorMessage) {
        return (
            <View style={Styles.errorview}>
                <Text category="h2" style={Styles.errortitle}>
                    Ouch 🤕
                </Text>
                <Text
                    style={Styles.errormessage}
                >{`${errorMessage}.  Click below to go back.`}</Text>
                <Button
                    status="warning"
                    onPress={() => {
                        navigation.navigate(ROUTES.PODSLIST_SCREEN)
                    }}
                >
                    Back
                </Button>
            </View>
        )
    }
    if (getPodAsInviteeLoading) return <AppLoading />
    // if (getPodAsInviteeError) throw Error(getPodAsInviteeError.message)

    const { name: podName, publicDescription: podDesc } =
        getPodAsInviteeData?.getPodDetailsAsInvitee || {}

    const onJoinPod = async () => {
        setLoading(true)
        const mutationArgsJoinPod: MutationJoinPodArgs = {
            podId,
        }
        await joinPod({
            variables: mutationArgsJoinPod,
            refetchQueries: ['listMyPods'],
        })
        navigation.navigate(ROUTES.PODSLIST_SCREEN)
        setLoading(false)
    }

    return (
        <SafeAreaView style={Styles.safearea}>
            <Header
                title={`You've been invited!`}
                onBack={() => navigation.goBack()}
            />
            <Layout style={Styles.layout}>
                <Layout>
                    <Text category="h3">{`Join ${podName}`}</Text>
                    <Text style={Styles.podDesc}>{podDesc}</Text>
                </Layout>

                <Divider />
                <LottieView
                    source={INVITATION_ANIMATION.LOTTIE}
                    autoPlay
                    loop={false}
                />
                <Divider />
                <Layout style={Styles.buttonLayout}>
                    <Button size="large" onPress={onJoinPod} disabled={loading}>
                        Accept
                    </Button>
                    <Button
                        status="basic"
                        size="large"
                        onPress={() =>
                            navigation.navigate(ROUTES.PROFILE_ACTIVITY)
                        }
                        disabled={loading}
                    >
                        Decline
                    </Button>
                </Layout>
            </Layout>
        </SafeAreaView>
    )
}

const Styles = StyleSheet.create({
    safearea: {
        flex: 1,
        backgroundColor: COLORS.WHITE['100'],
    },
    layout: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 30,
    },
    buttonLayout: {
        height: '20%',
        justifyContent: 'space-around',
        width: '100%',
    },
    errorview: {
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        alignContent: 'center',
        textAlign: 'center',
    },
    errortitle: {
        textAlign: 'left',
    },
    errormessage: {
        fontSize: 20,
        lineHeight: 25,
        textAlign: 'left',
        marginVertical: 20,
    },
    podDesc: {
        fontWeight: 'bold',
        marginTop: 20,
    },
})

export default JoinPodScreen
