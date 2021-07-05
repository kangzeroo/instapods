import React, { useEffect, useState, useRef } from 'react'
import {
    StyleSheet,
    ScrollView,
    View,
    Image,
    RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { useQuery } from '@apollo/react-hooks'
import {
    Text,
    Card,
    Layout,
    Icon,
    TopNavigation,
    TopNavigationAction,
    Button,
    Modal,
} from '@ui-kitten/components'
import { useDispatch, useSelector } from 'react-redux'
import { WhiteSpace } from '@ant-design/react-native'
import {
    CHOOSE_POD,
    TOGGLE_BOTTOM_BAR_VISIBLE,
    SET_CURRENT_ROUTE,
} from '../../../redux/actions.redux'
import { ROUTES } from '../../../common/constants'
import { FONTS, COLORS } from '../../../styles'
import { GET_POD_LIST } from './get-pods-list.gql'
import { PodPreview, Drop_Fragment } from '../../../generated-types'
import NoPodsSplash from './no-pods-splash.component'
import NotificationBar from '../../../common/components/notification-bar.component'
import {
    IReactNavigationPlug,
    IImageCompatibilityPlug,
} from '../../../types.any'
import { LogoHeader } from '../../../common/components/header-logo.component'
import { AppLoading } from '../../../common/components/app-loading.component'
import { KarmaTag } from '../../../common/components/karma-tag.component'
import { IReduxState } from '../../../redux/state.redux'
import InviteFriendsModal from './invite-friends-modal.component'

type Props = { navigation: IReactNavigationPlug }
const PodsListScreen = ({ navigation }: Props) => {
    const dispatch = useDispatch()
    const [modalVisible, setModalVisible] = useState(false)
    const refetchOnNotification: boolean = useSelector(
        (state: IReduxState) => state.refetchOnNotification
    )
    const [isRefreshing, setIsRefreshing] = useState(false)
    useEffect(() => {
        dispatch({
            type: SET_CURRENT_ROUTE,
            payload: ROUTES.PODSLIST_SCREEN,
        })
        const unsubscribe = navigation.addListener('focus', () => {
            dispatch({
                type: TOGGLE_BOTTOM_BAR_VISIBLE,
                payload: true,
            })
        })
        return unsubscribe
    }, [navigation, dispatch])
    const { loading, error, data, refetch } = useQuery(GET_POD_LIST)
    const prevRefetchOnNotificationRef: any = useRef()
    useEffect(() => {
        prevRefetchOnNotificationRef.current = refetchOnNotification
    })
    const prevRefetchOnNotification: boolean =
        prevRefetchOnNotificationRef.current

    useEffect(() => {
        if (refetchOnNotification && !prevRefetchOnNotification) {
            // eslint-disable-next-line no-console
            console.log('refetching pod list')
            refetch()
        }
    }, [refetchOnNotification, prevRefetchOnNotification, refetch])

    if (loading) {
        return <AppLoading />
    }
    if (error) {
        const errorMessage = (error?.message || '')?.replace(
            'GraphQL error: ',
            ''
        )
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
                    onPress={() =>
                        navigation.navigate(ROUTES.LOGGED_IN_SECTION)
                    }
                >
                    Back
                </Button>
            </View>
        )
    }
    const closeModal = () => {
        setModalVisible(false)
    }
    const openModal = () => {
        setModalVisible(true)
    }
    const onRefresh = () => {
        setIsRefreshing(true)
        refetch()
            .then(() => {
                setIsRefreshing(false)
            })
            .catch(() => {
                setIsRefreshing(false)
            })
    }

    const podsList: Array<PodPreview> = data.listMyPods
    const goToPodView = (podId: string): void => {
        dispatch({
            type: TOGGLE_BOTTOM_BAR_VISIBLE,
            payload: false,
        })
        dispatch({
            type: CHOOSE_POD,
            payload: podId,
        })
        navigation.navigate(ROUTES.PODVIEW_SCREEN)
    }
    const createPod = () => {
        dispatch({
            type: TOGGLE_BOTTOM_BAR_VISIBLE,
            payload: false,
        })
        navigation.navigate(ROUTES.POD_ONBOARDING.NAVIGATION)
    }
    const dropImage = (
        img: IImageCompatibilityPlug,
        idx: number = 1,
        dropLength?: number
    ) => {
        let style = Styles.headerImage
        if (dropLength && dropLength > 2) {
            // round outer borders on idx 1 and 3
            if (idx === 0) {
                style = { ...style, ...Styles.leftImageBorderRadius }
            } else if (idx === 2) {
                style = { ...style, ...Styles.rightImageBorderRadius }
            }
        } else if (dropLength && dropLength === 2) {
            // round on 1 and 2
            if (idx === 0) {
                style = { ...style, ...Styles.leftImageBorderRadius }
            } else if (idx === 1) {
                style = { ...style, ...Styles.rightImageBorderRadius }
            }
        } else if (dropLength && dropLength === 1) {
            style = {
                ...style,
                ...Styles.rightImageBorderRadius,
                ...Styles.leftImageBorderRadius,
            }
        }

        return (
            <View key={img[0].uri} style={Styles.imageWrapper}>
                <Image style={style} source={img} />
            </View>
        )
    }
    const AddIcon = (style: object) => <Icon {...style} name="plus-outline" />
    const AddFriendIcon = (style: object) => (
        <Icon {...style} name="person-add-outline" />
    )
    const Logo = () => (
        <View style={Styles.logoWrap}>
            <LogoHeader />
        </View>
    )
    return (
        <SafeAreaView style={Styles.safearea}>
            <NotificationBar navigation={navigation} />
            <TopNavigation
                alignment="start"
                title="Create Pod"
                leftControl={
                    <TopNavigationAction
                        icon={AddIcon}
                        onPress={() => createPod()}
                    />
                }
                rightControls={
                    <TopNavigationAction
                        icon={AddFriendIcon}
                        onPress={openModal}
                    />
                }
            />
            <Layout style={Styles.layout}>
                {podsList && podsList.length > 0 ? (
                    <ScrollView
                        style={Styles.podsList}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    >
                        {Logo()}
                        <WhiteSpace />
                        {podsList
                            .sort(
                                (a, b) =>
                                    b.recentDrops.length - a.recentDrops.length
                            )
                            .map((pod: PodPreview) => {
                                const recentDrops = pod.recentDrops.filter(
                                    (drop: Drop_Fragment) =>
                                        pod.members.indexOf(drop.userId) > -1
                                ) // filter out only from members in the pod
                                recentDrops.sort(
                                    (a: Drop_Fragment, b: Drop_Fragment) =>
                                        b.scheduledDate._seconds -
                                        a.scheduledDate._seconds
                                )
                                return (
                                    <View
                                        key={pod.id}
                                        style={Styles.cardWrapper}
                                    >
                                        <Card
                                            style={Styles.card}
                                            onPress={() => goToPodView(pod.id)}
                                        >
                                            <View style={Styles.header}>
                                                <Text
                                                    style={Styles.headerText}
                                                    numberOfLines={1}
                                                    ellipsizeMode="tail"
                                                    category="h6"
                                                >
                                                    {pod.name}
                                                </Text>

                                                <View
                                                    style={Styles.rowContainer}
                                                >
                                                    <View
                                                        style={
                                                            Styles.karmaContainer
                                                        }
                                                    >
                                                        {KarmaTag(pod.karma)}
                                                    </View>
                                                </View>

                                                {/* <View style={Styles.badgeWrap}>
                                                <Text style={Styles.badge}>
                                                    {`${pod.recentDrops.length}`}
                                                </Text>
                                            </View> */}
                                            </View>

                                            <View style={Styles.recentDrops}>
                                                {recentDrops &&
                                                recentDrops.length > 0 ? (
                                                    recentDrops
                                                        .slice(
                                                            0,
                                                            Math.min(
                                                                pod.recentDrops
                                                                    .length,
                                                                3
                                                            )
                                                        )
                                                        .map((drop, idx) =>
                                                            dropImage(
                                                                drop.image,
                                                                idx,
                                                                pod.recentDrops
                                                                    .length
                                                            )
                                                        )
                                                ) : (
                                                    <View
                                                        style={
                                                            Styles.noRecentPostsDropped
                                                        }
                                                    >
                                                        <Text>
                                                            No recent posts...
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        </Card>
                                    </View>
                                )
                            })}
                    </ScrollView>
                ) : (
                    <>
                        {Logo()}
                        <NoPodsSplash createPodOnboarding={createPod} />
                    </>
                )}
            </Layout>
            <Modal
                backdropStyle={Styles.backdrop}
                onBackdropPress={closeModal}
                visible={modalVisible}
            >
                <InviteFriendsModal
                    pods={podsList}
                    navigation={navigation}
                    closeModal={closeModal}
                />
            </Modal>
        </SafeAreaView>
    )
}

const Styles = StyleSheet.create({
    safearea: {
        flex: 1,
        backgroundColor: COLORS.WHITE['100'],
    },
    backdrop: {
        backgroundColor: COLORS.SHADE['100'],
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
    layout: {
        flex: 1,
        padding: 5,
        backgroundColor: COLORS.WHITE['100'],
    },
    logoWrap: {
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 20,
        height: 80,
    },
    podActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    logo: {
        fontSize: 32,
        lineHeight: 45,
        fontFamily: FONTS.LOGO_FONT,
        textAlign: 'center',
    },
    card: {
        borderRadius: 10,
        justifyContent: 'center',
        alignContent: 'flex-start',
        textAlignVertical: 'center',
        borderWidth: 0,
    },
    cardWrapper: {
        borderRadius: 10,
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        borderColor: COLORS.BLACK['200'],
        borderWidth: 1,
        marginBottom: 20,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        flexWrap: 'wrap',
    },
    headerText: {
        fontFamily: FONTS.FORMAL,
        textTransform: 'uppercase',
        fontSize: 16,
        color: COLORS.BLACK['500'],
        justifyContent: 'center',
        textAlignVertical: 'center',
        alignSelf: 'center',
        paddingTop: 8,
        overflow: 'hidden',
        // width: '85%',
    },
    badgeWrap: {
        justifyContent: 'center',
        alignContent: 'center',
        height: 35,
        width: 35,
        borderRadius: 30,
        marginTop: 0,
        backgroundColor: COLORS.GREEN['500'],
    },
    badge: {
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    headerImage: {
        flex: 1,
        // height: 110,
        aspectRatio: 0.9,
        width: '100%',
        overflow: 'hidden',
    },
    leftImageBorderRadius: {
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
    rightImageBorderRadius: {
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    imageWrapper: {
        // shadowOffset: {
        //     width: 10,
        //     height: 10,
        // },
        // shadowOpacity: 0.1,
        // shadowRadius: 5,
        marginBottom: 0,
        width: '33.333%',
        marginRight: 0,
        borderColor: 'white',
        borderRightWidth: 1,
        borderLeftWidth: 1,
    },
    cardDesc: {},
    loadingLayout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recentDrops: {
        marginTop: 15,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    rowContainer: {
        flexDirection: 'row',
    },
    karmaContainer: {
        marginTop: 4,
        paddingRight: 6,
    },
    noRecentPostsDropped: {
        marginTop: -15,
    },
    podsList: {
        paddingHorizontal: 10,
        // marginTop: 20,
    },
})

export default PodsListScreen
