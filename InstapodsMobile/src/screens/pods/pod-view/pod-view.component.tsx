import React, { useEffect, useState, useRef } from 'react'
import {
    StyleSheet,
    ScrollView,
    FlatList,
    View,
    Image,
    BackHandler,
    TouchableHighlight,
    RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-navigation'
import analytics from '@react-native-firebase/analytics'
import {
    Text,
    List,
    Layout,
    Spinner,
    Modal,
    Button,
} from '@ui-kitten/components'
import { Tabs } from '@ant-design/react-native'
import { useQuery } from '@apollo/react-hooks'
import { useDispatch, useSelector } from 'react-redux'
import {
    TOGGLE_BOTTOM_BAR_VISIBLE,
    SET_CURRENT_ROUTE,
    SET_DROP_FUNCTIONALITY,
} from '../../../redux/actions.redux'
import PodNoMembersSplash from './splash/pod-has-no-members-splash.component'
import { timestampToMoment } from '../../../common/utils'
import { ROUTES, MARKED_COMPLETE, DECLINE } from '../../../common/constants'
import { GET_POD_AS_MEMBER } from './pod-view.gql'
import {
    GOOGLE_ANALYTICS_ITEM_CATEGORIES,
    POD_VIEW_TYPES,
} from '../../../common/analytics'
import { COLORS } from '../../../styles'
import { isInteractionType } from '../../drop/async-storage.utility'
import {
    Drop_Fragment,
    QueryGetPodDetailsAsMemberArgs,
    PublicUser,
} from '../../../generated-types'
import {
    IReactNavigationPlug,
    IImageCompatibilityPlug,
    IDropStorageItem,
    IGrided_Drop_Fragment,
} from '../../../types.any'
import { IReduxState } from '../../../redux/state.redux'
import { Header } from '../../../common/components/header.component'
import {
    tabs,
    uploadingDropNotif,
    uploadingDropErrorNotif,
    successNotif,
    NoDropMemberDrops,
    AddDropButton,
    ButtonFill,
} from './pod-view.utility'
import NoDropsSplash from '../../profile/profile-activity/no-drops-splash.component'
import DropQuickPreview from '../../drop/drop-pre-engagement/drop-pre-engagement-quickview.component'
import DropSnapshot from '../../drop/drop-snapshot/drop-snapshot.component'
import Typewriter from '../../../common/components/typewriter.component'
// import DismissKeyboardHOC from '../../../common/components/keyboard-dismiss-hoc.component'
import PodInviteModal from '../manage-pod/modals/pod-invite-modal.component'

const pageSize = 8 * 3 // 7 rows of 3 columns   - will load more when we get to bottom of scroll

type Props = { navigation: IReactNavigationPlug }
const PodViewScreen = ({ navigation }: Props) => {
    const dispatch = useDispatch()
    const [isRefreshing, setIsRefreshing] = useState(false)
    // const [isSuccess, setSuccess] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)
    const [showInviteModal, setShowInviteModal] = useState(false)
    const refetchOnNotification: boolean = useSelector(
        // forces a refetch (used for notifications)
        (state: IReduxState) => state.refetchOnNotification
    )
    // blur out completed/declined Drops:
    const storageDropArray: Array<IDropStorageItem> = useSelector(
        (state: IReduxState) => state.storageDropArray
    )
    const {
        loading: isUploadingDrop,
        error: isUploadingDropError,
        success: isUploadingDropSuccess,
        // podIds: uploadingDropPodIds,
    } = useSelector((state: IReduxState) => state.uploadingDrop)
    const podId = useSelector((state: IReduxState) => state.currentPod)

    const currentUser = useSelector((state: IReduxState) => state.userParams)
    const isUserDrop = (drop: Drop_Fragment): boolean => {
        return drop.userId === currentUser.id
    }
    const visible = useSelector(
        (state: IReduxState) => state.dropFunctionality.visible
    )

    const backButtonCallback = () => {
        navigation.goBack()
        dispatch({
            type: TOGGLE_BOTTOM_BAR_VISIBLE,
            payload: true,
        })
        dispatch({
            type: SET_CURRENT_ROUTE,
            payload: ROUTES.PODSLIST_SCREEN,
        })
    }
    useEffect(() => {
        analytics().logViewItem({
            item_id: podId,
            item_name: POD_VIEW_TYPES.GENERIC_POD_VIEW,
            item_category: GOOGLE_ANALYTICS_ITEM_CATEGORIES.VIEW_POD,
        })
        BackHandler.addEventListener('hardwareBackPress', backButtonCallback)
    })

    // get our data
    const queryArgs: QueryGetPodDetailsAsMemberArgs = {
        podId,
    }
    const { loading, error, data, refetch } = useQuery(GET_POD_AS_MEMBER, {
        variables: queryArgs,
    })

    // // do a "success message after uploading drop"
    // const prevUploadingDropRef: any = useRef()
    // useEffect(() => {
    //     prevUploadingDropRef.current = isUploadingDrop
    // })
    // const prevUploadingDrop: boolean = prevUploadingDropRef.current
    // useEffect(() => {
    //     if (!isUploadingDrop && prevUploadingDrop) {
    //         setSuccess(true)
    //         setTimeout(() => {
    //             setSuccess(false)
    //         }, 4000)
    //     }
    // }, [isUploadingDrop, prevUploadingDrop])

    const prevRefetchOnNotificationRef: any = useRef()
    useEffect(() => {
        prevRefetchOnNotificationRef.current = refetchOnNotification
    })
    const prevRefetchOnNotification: boolean =
        prevRefetchOnNotificationRef.current

    useEffect(() => {
        if (refetchOnNotification && !prevRefetchOnNotification) {
            // eslint-disable-next-line no-console
            console.log('refetch pod view')
            refetch()
        }
    }, [refetchOnNotification, prevRefetchOnNotification, refetch])

    if (loading) {
        return (
            <Layout style={Styles.loadingLayout}>
                {/* <Spinner size="giant" /> */}
                <Typewriter />
            </Layout>
        )
    }

    if (error) {
        return (
            <View style={Styles.errorview}>
                <Text category="h2" style={Styles.errortitle}>
                    Ouch 🤕
                </Text>
                <Text
                    style={Styles.errormessage}
                >{`${error?.message}.  Click below to go back.`}</Text>
                <Button
                    status="warning"
                    onPress={() => {
                        navigation.navigate(ROUTES.PODSLIST_SCREEN)
                        dispatch({
                            type: TOGGLE_BOTTOM_BAR_VISIBLE,
                            payload: true,
                        })
                    }}
                >
                    Back
                </Button>
            </View>
        )
    }

    const { name, recentDrops, members } = data?.getPodDetailsAsMember

    // determines is specified drop has been created by a user that left the pod
    const filterDropUsers = (drop: Drop_Fragment) => {
        if (members.map((d: any) => d.id).indexOf(drop.userId) === -1) {
            // filters out any drops that were posted by users THAT LEFT THE POD
            return false
        }
        return true
    }

    // --------------------- sort global variable recentDrops and gridDrops etc ---------------------
    // now we set / sort the main variables in this component
    // this gets a little messy, please look for the next section "---------" after the variables are sorted / set etc

    // sort recentDrops by date!
    recentDrops.sort((a: Drop_Fragment, b: Drop_Fragment): number => {
        return (
            timestampToMoment(b.droppedDate).valueOf() -
            timestampToMoment(a.droppedDate).valueOf()
        )
    })

    // now sort them by marked complete / declined and putting the logged in users drops last
    recentDrops.sort((a: Drop_Fragment, b: Drop_Fragment) => {
        const idx: Array<boolean> = [a, b].map(
            (d: Drop_Fragment) =>
                storageDropArray.map(dd => dd.dropId).indexOf(d.id) === -1 &&
                !isUserDrop(d)
        )
        // // put users own drops last:
        // const isUserDropA = isUserDrop(a)
        // const isUserDropB = isUserDrop(b)
        // if (isUserDropA && isUserDropB) {
        //     return -1
        // }
        // if (isUserDropA) {
        //     return 1
        // }
        // if (isUserDropB) {
        //     return -1
        // }

        // list of a, b in AsyncStorage completed drops
        if (idx.every(f => f) || idx.every(f => !f)) {
            return 0
        }
        if (idx[0]) {
            return -1
        }
        return 1
    })

    const gridDrops: Array<IGrided_Drop_Fragment> = recentDrops
        .filter(filterDropUsers) // filters for only current members
        .map((d: Drop_Fragment, i: number) => ({
            // assign a grid id
            ...d,
            gridId: `${d.id}-${i}`,
        }))

    const dropListElements: Array<Drop_Fragment> = recentDrops.filter(
        (drop: Drop_Fragment) =>
            !isUserDrop(drop) && // only show pod member drops (not logged in user)
            filterDropUsers(drop) && // dont show any drops from members that left pod
            !isInteractionType(
                // discard DECLINED / COMPLETED DROPS from this list
                drop.id,
                [DECLINE, MARKED_COMPLETE],
                storageDropArray
            )
    )

    // --------------------- some random functions / Components ---------------------

    const LoadingPage = () => (
        <View style={Styles.loadingContainer}>
            <Spinner />
        </View>
    )

    const closeModal = () => {
        dispatch({
            type: SET_DROP_FUNCTIONALITY,
            payload: { visible: false, drop: null, type: null },
        })
    }

    const previewDrop = (drop: Drop_Fragment) => {
        // send to preview drop page
        navigation.navigate(ROUTES.PREVIEW_DROP, {
            dropId: drop.id,
        })
    }

    const sendToNewDrop = () => {
        dispatch({
            type: TOGGLE_BOTTOM_BAR_VISIBLE,
            payload: false,
        })
        navigation.navigate(ROUTES.DROP_ONBOARDING.NAVIGATION)
    }

    const getMemberImage = (userId: string) => {
        return data.getPodDetailsAsMember.members.filter(
            (member: PublicUser) => member.id === userId
        )[0].image
    }

    const getMemberKarma = (userId: string) => {
        return data.getPodDetailsAsMember.members.filter(
            (member: PublicUser) => member.id === userId
        )[0].karma
    }

    const dropList = () => {
        if (dropListElements.length > 0) {
            return (
                <List
                    data={dropListElements}
                    renderItem={({ item }: { item: Drop_Fragment }) => (
                        // dropListItem(item)
                        <DropSnapshot
                            dropItem={item}
                            dropperImage={getMemberImage(item.userId)}
                            dropperKarma={getMemberKarma(item.userId)}
                            navigation={navigation}
                        />
                    )}
                    style={{ backgroundColor: COLORS.WHITE['100'] }}
                />
            )
        }
        return null
    }

    // --------------------- components depending on recentDrops and gridDrops ---------------------

    const dropGridItem = (drop: IGrided_Drop_Fragment) => {
        let imageStyle = Styles.headerImage
        const isShaded =
            isInteractionType(
                drop.id,
                [MARKED_COMPLETE, DECLINE],
                storageDropArray
            ) || isUserDrop(drop)
        if (isInteractionType(drop.id, [MARKED_COMPLETE], storageDropArray)) {
            imageStyle = { ...imageStyle, ...Styles.completedHeaderImage }
        } else if (isInteractionType(drop.id, [DECLINE], storageDropArray)) {
            imageStyle = { ...imageStyle, ...Styles.declinedHeaderImage }
        } else if (isUserDrop(drop)) {
            imageStyle = { ...imageStyle, ...Styles.userDropHeaderImage }
        }
        return (
            <View style={Styles.imageWrapper}>
                <TouchableHighlight
                    onPress={() => previewDrop(drop)}
                    style={Styles.imageContainer}
                >
                    <View style={Styles.gridImageContainer}>
                        <Image
                            style={imageStyle}
                            source={drop.image as IImageCompatibilityPlug}
                        />
                        {!isShaded && <Spinner />}
                    </View>
                </TouchableHighlight>
            </View>
        )
    }

    const returnGridInfoMessage = () => {
        if (members.length === 1 && gridDrops.length === 0) {
            return (
                <PodNoMembersSplash
                    setShowInviteModal={() => setShowInviteModal(true)}
                />
            )
        }
        if (
            gridDrops.filter((d: Drop_Fragment) => isUserDrop(d)).length === 0
        ) {
            let style = Styles.noDropMemberDropsWrapper
            if (gridDrops.length > 0) {
                // lets just give it smaller top margin because there are other member drops
                style = Styles.negativeMarginContainer
            }
            // return NoUserDrops()
            return (
                <View style={style}>
                    <NoDropsSplash
                        goToNewDrop={() => {
                            dispatch({
                                type: TOGGLE_BOTTOM_BAR_VISIBLE,
                                payload: false,
                            })
                            navigation.navigate(
                                ROUTES.DROP_ONBOARDING.NAVIGATION
                            )
                        }}
                    />
                </View>
            )
        }
        return null
    }

    const returnListInfoMessage = () => {
        if (members.length === 1) {
            return (
                <PodNoMembersSplash
                    setShowInviteModal={() => setShowInviteModal(true)}
                />
            )
        }

        if (
            dropListElements.filter((d: Drop_Fragment) => !isUserDrop(d))
                .length === 0
        ) {
            return NoDropMemberDrops()
        }
        return null
    }

    const getGridPodDrops = () => {
        const gridData: Array<IGrided_Drop_Fragment> =
            gridDrops.slice(0, pageSize * pageNumber) || []

        return (
            <View style={Styles.parentListContainer}>
                <FlatList
                    data={gridData}
                    renderItem={({ item }: { item: IGrided_Drop_Fragment }) => {
                        return dropGridItem(item)
                    }}
                    keyExtractor={(item: IGrided_Drop_Fragment) => item.gridId}
                    style={Styles.layout}
                    numColumns={3}
                />
            </View>
        )
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

    const Refresher = () => (
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
    )

    const doChange: boolean = gridDrops
        ? pageNumber * pageSize < gridDrops.length
        : false

    const onScrollMomentumEnd = (e: any) => {
        // NOTE: this depends on gridData - needs to be below lol
        // loads more drops if at the end of scroll
        const offset = e.nativeEvent.contentOffset.y
        const fakeDeviceHeight = 500 // approximation
        if (offset / pageNumber > (2 / 3) * fakeDeviceHeight) {
            // this tries to only load if at bottom (ish) of screen
            if (doChange) {
                setTimeout(() => {
                    if (doChange) {
                        setPageNumber(pageNumber + 1)
                    }
                }, 600)
            }
        }
    }

    return (
        <SafeAreaView style={Styles.safearea}>
            <Header
                onBack={backButtonCallback}
                title={name}
                action={{
                    icon: 'settings-outline',
                    onPress: () => navigation.navigate(ROUTES.MANAGEPOD_SCREEN),
                }}
            />

            <Tabs tabs={tabs(dropListElements.length)} initialPage={1}>
                <ScrollView
                    style={Styles.tabContainer}
                    refreshControl={Refresher()}
                >
                    {isUploadingDrop && uploadingDropNotif()}
                    {isUploadingDropError &&
                        uploadingDropErrorNotif(navigation)}
                    {isUploadingDropSuccess && successNotif()}
                    {dropList()}
                    {returnListInfoMessage()}
                    {ButtonFill()}
                </ScrollView>
                <ScrollView
                    style={Styles.tabContainer}
                    refreshControl={Refresher()}
                    onMomentumScrollEnd={onScrollMomentumEnd}
                >
                    {isUploadingDrop && uploadingDropNotif()}
                    {isUploadingDropError &&
                        uploadingDropErrorNotif(navigation)}
                    {isUploadingDropSuccess && successNotif()}
                    {getGridPodDrops()}
                    {returnGridInfoMessage()}
                    {ButtonFill()}
                    {doChange && <LoadingPage />}
                </ScrollView>
            </Tabs>

            {AddDropButton(sendToNewDrop)}
            {/* theres a minor bug with the below modal... it is replicated in drop-pre-engagement-fullview, which some reason will still 
                render (if you have altready been to that page). It works out though because it renders below this one, so only one gets pressed. But nontheless, the second is there when 
                it really shouldnt be :(. also engageDrop DOES NOT get called twice thank god --- tangris 
            */}
            <Modal
                backdropStyle={Styles.backdrop}
                onBackdropPress={closeModal}
                visible={visible}
            >
                <DropQuickPreview />
            </Modal>
            <Modal
                backdropStyle={Styles.backdrop}
                onBackdropPress={() => setShowInviteModal(false)}
                visible={showInviteModal}
            >
                <PodInviteModal
                    closeModal={() => setShowInviteModal(false)}
                    pod={data.getPodDetailsAsMember}
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
    layout: {
        flex: 1,
        backgroundColor: COLORS.WHITE['100'],
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
    imageWrapper: {
        width: '33.333%',
        padding: 5,
    },
    imageContainer: {
        // height: 110,
        aspectRatio: 1,
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        borderRadius: 5,
    },
    gridImageContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: COLORS.BLACK['100'],
    },
    headerImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 100,
    },
    completedHeaderImage: {
        opacity: 0.2,
    },
    declinedHeaderImage: {
        opacity: 0.2,
    },
    userDropHeaderImage: {
        opacity: 0.2,
    },
    tabContainer: {
        height: '100%',
        backgroundColor: COLORS.WHITE['100'],
    },
    loadingLayout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    loadingTile: {
        backgroundColor: COLORS.BLACK['200'],
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        // width: '100%',
    },
    backdrop: {
        backgroundColor: COLORS.SHADE['100'],
    },
    parentListContainer: {
        flex: 1,
        padding: 10,
    },
    uploadingText: { marginTop: 5 },
    noDropMemberDropsWrapper: {
        paddingTop: 100,
    },
    negativeMarginContainer: {
        marginTop: -60,
        paddingTop: 0,
        zIndex: -100,
    },
    loadingContainer: {
        height: 80,
        marginTop: -20,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default PodViewScreen
