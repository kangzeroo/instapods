import React from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { onError } from 'apollo-link-error'
import {
    Layout,
    Text,
    Spinner,
    Card,
    Icon,
    Button,
} from '@ui-kitten/components'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { useDispatch } from 'react-redux'
import { DISCOVER_POD, JOIN_POD } from './pods-discover.gql'
import { FONTS, COLORS } from '../../../styles'
import { ROUTES } from '../../../common/constants'
import {
    CHOOSE_POD,
    TOGGLE_BOTTOM_BAR_VISIBLE,
} from '../../../redux/actions.redux'
import {
    PublicPodPreview,
    QueryDiscoverPublicPodArgs,
    MutationJoinPodArgs,
} from '../../../generated-types'
import { IReactNavigationPlug } from '../../../types.any'

const Styles = StyleSheet.create({
    layout: {
        flex: 1,
        padding: 10,
        marginTop: 20,
    },
    loadingLayout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    card: {
        borderRadius: 10,
        justifyContent: 'center',
        alignContent: 'flex-start',
        textAlignVertical: 'center',
        marginBottom: 10,
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignContent: 'center',
        width: '80%',
    },
    headerText: {
        fontFamily: FONTS.FORMAL,
        textTransform: 'uppercase',
        fontSize: 18,
        color: COLORS.BLACK['500'],
        justifyContent: 'center',
        textAlignVertical: 'center',
        alignSelf: 'flex-start',
        paddingTop: 8,
        overflow: 'hidden',
    },
    slugWrap: {
        justifyContent: 'center',
        alignContent: 'flex-start',
        marginBottom: 10,
    },
    statWrap: {
        justifyContent: 'center',
        alignContent: 'flex-start',
        marginTop: 0,
    },
    stat: {},
    contents: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    join: {
        width: '20%',
        alignItems: 'flex-end',
    },
})

type Props = {
    slug: string
    navigation: IReactNavigationPlug
    clearResults: () => void
}
const PodsDiscoverResults = ({
    slug: podSlug,
    navigation,
    clearResults,
}: Props) => {
    const dispatch = useDispatch()
    const queryArgs: QueryDiscoverPublicPodArgs = {
        slug: podSlug,
    }
    const { loading, error, data } = useQuery(DISCOVER_POD, {
        variables: queryArgs,
    })
    const [
        joinPod,
        { loading: loadingJoinPod, error: errorJoinPod },
    ] = useMutation(JOIN_POD)
    if (loading) {
        return (
            <Layout style={Styles.loadingLayout}>
                <Spinner size="giant" />
            </Layout>
        )
    }
    if (error) {
        return (
            <Layout style={Styles.loadingLayout}>
                <Text>Error Joining Pod</Text>
                <Button
                    appearance="ghost"
                    status="warning"
                    onPress={clearResults}
                >
                    RETRY
                </Button>
            </Layout>
        )
    }
    const matchingPod: PublicPodPreview = data?.discoverPublicPod

    const attemptJoinPod = async (id: string) => {
        const mutationArgs: MutationJoinPodArgs = {
            podId: id,
        }
        await joinPod({
            variables: mutationArgs,
            refetchQueries: ['listMyPods'],
        })
        dispatch({
            type: CHOOSE_POD,
            payload: id,
        })
        dispatch({
            type: TOGGLE_BOTTOM_BAR_VISIBLE,
            payload: false,
        })
        navigation.navigate(ROUTES.PODVIEW_SCREEN)
    }
    if (loadingJoinPod) {
        return (
            <Layout style={Styles.loadingLayout}>
                <Spinner size="giant" />
            </Layout>
        )
    }
    if (errorJoinPod) {
        return (
            <Layout>
                <Button
                    appearance="ghost"
                    status="warning"
                    onPress={clearResults}
                >
                    RETRY
                </Button>
                <Text>Error Joining Pod</Text>
            </Layout>
        )
    }
    return (
        <ScrollView style={Styles.layout}>
            <Button appearance="ghost" status="warning" onPress={clearResults}>
                CLEAR RESULTS
            </Button>
            {[matchingPod].map((pod: PublicPodPreview) => (
                <Card key={pod.id} style={Styles.card}>
                    <View style={Styles.contents}>
                        <View style={Styles.header}>
                            <Text
                                style={Styles.headerText}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                category="h5"
                            >
                                {pod.name}
                            </Text>
                            <View style={Styles.slugWrap}>
                                <Text
                                    style={Styles.stat}
                                >{`@ ${pod.slug}`}</Text>
                            </View>
                            <View style={Styles.statWrap}>
                                <Text style={Styles.stat}>
                                    {`${pod.membersCount} Members`}
                                </Text>
                            </View>
                            <View style={Styles.statWrap}>
                                <Text style={Styles.stat}>
                                    {`${pod.recentDropsCount} Recent Drops`}
                                </Text>
                            </View>
                        </View>
                        <View style={Styles.join}>
                            <Icon
                                name="person-add-outline"
                                width={32}
                                height={32}
                                fill={COLORS.BLACK['700']}
                                onPress={() => attemptJoinPod(pod.id)}
                            />
                        </View>
                    </View>
                </Card>
            ))}
        </ScrollView>
    )
}

export default PodsDiscoverResults
