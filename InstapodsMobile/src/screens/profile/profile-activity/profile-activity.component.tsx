import React, { useEffect, useState } from 'react'
import {
    StyleSheet,
    View,
    ScrollView,
    Image,
    TouchableHighlight,
    RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-navigation'
import auth from '@react-native-firebase/auth'
import { useQuery } from '@apollo/react-hooks'
import { Grid, WhiteSpace } from '@ant-design/react-native'
import {
    Layout,
    Text,
    TopNavigation,
    TopNavigationAction,
    Icon,
    Avatar,
    Spinner,
    Modal,
    Button,
} from '@ui-kitten/components'
import { useDispatch, useSelector } from 'react-redux'
import { TouchableOpacity } from 'react-native-gesture-handler'
// import { FONTS } from '../../../common/styles'
import NotificationBar from '../../../common/components/notification-bar.component'
import { GET_MY_PROFILE } from './profile-activity.gql'
import NoDropsSplash from './no-drops-splash.component'
import { ROUTES } from '../../../common/constants'
import {
    TOGGLE_BOTTOM_BAR_VISIBLE,
    SET_USER_PARAMS,
    SET_CURRENT_ROUTE,
} from '../../../redux/actions.redux'
import { IReduxState } from '../../../redux/state.redux'
import { COLORS } from '../../../styles'
import LogoutConfirmationModal from './logout-confirmation-modal.component'
import { PrivateUser, Drop_Fragment } from '../../../generated-types'
import {
    IReactNavigationPlug,
    IImageCompatibilityPlug,
} from '../../../types.any'
import { KarmaTag } from '../../../common/components/karma-tag.component'

const horizontalPadding = 10
const imagePadding = 5
const pageSize = 7 * 3 // 7 rows of 3 columns   - will load more when we get to bottom of scroll
const plusColor = COLORS.FONT.HYPERLINK

type Props = { navigation: IReactNavigationPlug }
const ProfileScreen = ({ navigation }: Props) => {
    const dispatch = useDispatch()
    const [pageNumber, setPageNumber] = useState(1)
    const {
        loading: uploadingDropLoading,
        error: uploadingDropError,
    } = useSelector((reduxState: IReduxState) => reduxState.uploadingDrop)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [showLogoutModal, setShowLogoutModal] = useState(false)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            dispatch({
                type: TOGGLE_BOTTOM_BAR_VISIBLE,
                payload: true,
            })
            dispatch({
                type: SET_CURRENT_ROUTE,
                payload: ROUTES.PROFILE_ACTIVITY,
            })
        })
        return unsubscribe
    }, [navigation, dispatch])
    const { loading, error, data: profileData, refetch } = useQuery(
        GET_MY_PROFILE
    )
    useEffect(() => {
        dispatch({ type: SET_USER_PARAMS, payload: profileData.getMyProfile })
    }, [profileData.getMyProfile, dispatch])
    if (loading) {
        return (
            <Layout style={Styles.loadingLayout}>
                <Spinner size="giant" />
            </Layout>
        )
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

    const {
        username,
        karma,
        image,
        drops,
    }: PrivateUser = profileData.getMyProfile

    const templateTag: string = 'template'
    const loadingTag: string = 'loading'
    const errorTag: string = 'error'
    /**
     * outputs the data used for profile grid (a list of Drop_Fragment or special keyword strings)
     * keywords:
     *      templateTag - creates a "+ New drop" tile at beginging
     *      loadingTag - creates a spinner where a tile should be (pure ux for when user adds a drop)
     */
    const returnGridData = () => {
        let output: Array<Drop_Fragment | string> = drops || []

        if (uploadingDropLoading) {
            output = output.filter(f => f !== loadingTag)
            output.unshift(loadingTag) // this will be a loading spinner
        } else if (uploadingDropError) {
            output = output.filter(f => f !== errorTag)
            output.unshift(errorTag) // this will be a loading spinner
        }
        // now add the templateTag:
        output = output.filter(f => f !== templateTag)

        // add a 'template' at the end, this makes the grid display a "plus" icon and create drop option
        output.unshift(templateTag) // this is a "new drop" tile

        return output
    }

    const gridData = returnGridData()
    const anyDrops = gridData && gridData.length > 1
    const doChange: boolean = gridData
        ? pageNumber * pageSize < gridData.length
        : false

    const SignoutIcon = (style: object) => (
        <Icon {...style} name="log-out-outline" />
    )
    const QuestionIcon = (style: object) => (
        <Icon {...style} name="question-mark-circle-outline" />
    )

    const reviewThisDrop = (drop: Drop_Fragment) => {
        navigation.navigate(ROUTES.PREVIEW_DROP, {
            dropId: drop.id,
        })
        dispatch({ type: TOGGLE_BOTTOM_BAR_VISIBLE, payload: false })
    }
    const profileAvatar = (img: IImageCompatibilityPlug) => {
        return (
            <Avatar
                style={Styles.avatar}
                size="giant"
                source={img}
                width={100}
                height={100}
                borderRadius={100}
            />
        )
    }
    const dropImage = (dropItem: any) => {
        const { image: img } = dropItem
        return (
            <View
                key={`profile-drop-${dropItem.id}`}
                style={Styles.dropImageContainer}
            >
                <TouchableHighlight
                    style={Styles.imageContainer}
                    onPress={() => onPressGridItem(dropItem)} // touchable highlight prevents this from being called in the grid
                    // underlayColor="transparent"
                >
                    <View style={Styles.previewImage}>
                        <Image
                            key={img[0].uri}
                            source={img}
                            style={Styles.imageElement}
                        />
                        <Spinner />
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
    const templateDropPreview = () => {
        return (
            <TouchableOpacity style={Styles.plainImageContainer}>
                <View
                    style={{ ...Styles.previewImage, ...Styles.createDropItem }}
                >
                    <Icon
                        fill={plusColor}
                        width="44px"
                        height="44px"
                        name="plus-outline"
                    />

                    <Text style={Styles.templateCreateText}>NEW DROP</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const loadingDropPreview = () => {
        return (
            <View style={Styles.plainImageContainer}>
                <View
                    style={{
                        ...Styles.previewImage,
                        ...Styles.createDropItem,
                    }}
                >
                    <WhiteSpace />
                    <Spinner />
                    <WhiteSpace />
                    <Text style={Styles.templateCreateText}>UPLOADING</Text>
                </View>
            </View>
        )
    }

    const errorDropPreview = () => {
        return (
            <View style={Styles.plainImageContainer}>
                <View
                    style={{
                        ...Styles.previewImage,
                        ...Styles.createDropItem,
                    }}
                >
                    <WhiteSpace />
                    <Text style={Styles.errorCross}>𝗫</Text>
                    <Text style={Styles.templateCreateText}>ERROR</Text>
                </View>
            </View>
        )
    }

    const LoadingPage = () => (
        <View style={Styles.loadingContainer}>
            <Spinner />
        </View>
    )

    const goToNewDrop = () => {
        dispatch({
            type: TOGGLE_BOTTOM_BAR_VISIBLE,
            payload: false,
        })
        navigation.navigate(ROUTES.DROP_ONBOARDING.NAVIGATION)
    }

    const onPressGridItem = (dataItem: any) => {
        if (dataItem === templateTag) {
            // here we go to the "create drop" page
            goToNewDrop()
        } else if (dataItem === errorTag) {
            goToNewDrop()
        } else if (dataItem !== loadingTag) {
            reviewThisDrop(dataItem)
        }
    }

    const renderGridItem = (dataItem: any) => {
        // these are really Drop_Fragments
        if (dataItem === templateTag) {
            // returns a "+ drop" where a drop would normally go
            return templateDropPreview()
        }
        if (dataItem === loadingTag) {
            return loadingDropPreview()
        }
        if (dataItem === errorTag) {
            return errorDropPreview()
        }
        return dropImage(dataItem)
    }

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
            <NotificationBar navigation={navigation} />
            <TopNavigation
                alignment="start"
                leftControl={
                    <TopNavigationAction
                        icon={QuestionIcon}
                        onPress={() => {
                            navigation.navigate(ROUTES.HELP_FLOOR)
                            dispatch({
                                type: TOGGLE_BOTTOM_BAR_VISIBLE,
                                payload: false,
                            })
                        }}
                    />
                }
                rightControls={
                    <TopNavigationAction
                        icon={SignoutIcon}
                        onPress={() => setShowLogoutModal(true)}
                    />
                }
            />
            <ScrollView
                style={anyDrops ? Styles.mainScroll : Styles.emptyMainScroll}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                    />
                }
                removeClippedSubviews={true}
                onMomentumScrollEnd={onScrollMomentumEnd}
            >
                <Layout style={Styles.layout}>
                    {profileAvatar(image)}
                    <View style={Styles.profileInfo}>
                        <Text style={Styles.userName} numberOfLines={1}>
                            @{username}
                        </Text>

                        <View style={Styles.karmaContainer}>
                            {KarmaTag(karma)}
                        </View>
                    </View>
                </Layout>
                <View style={Styles.gridContainer}>
                    {anyDrops ? (
                        <Grid
                            data={gridData.slice(0, pageSize * pageNumber)}
                            columnNum={3}
                            renderItem={renderGridItem}
                            onPress={onPressGridItem}
                            hasLine={false}
                        />
                    ) : (
                        <View style={Styles.noDropsSplashStyle}>
                            <NoDropsSplash goToNewDrop={goToNewDrop} />
                        </View>
                    )}
                </View>
                {doChange && <LoadingPage />}
            </ScrollView>
            <Modal
                backdropStyle={Styles.backdrop}
                onBackdropPress={() => setShowLogoutModal(false)}
                visible={showLogoutModal}
            >
                <LogoutConfirmationModal
                    closeModal={() => setShowLogoutModal(false)}
                    logout={() => {
                        navigation.navigate(ROUTES.LOGIN_SCREEN)
                        auth().signOut()
                        setShowLogoutModal(false)
                    }}
                />
            </Modal>
        </SafeAreaView>
    )
}

export default ProfileScreen

const Styles = StyleSheet.create({
    safearea: {
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
    layout: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 180,
    },
    mainScroll: {
        flex: 1,
        backgroundColor: '#fff',
    },
    emptyMainScroll: {
        flex: 1,
    },
    avatar: {
        margin: 8,
        backgroundColor: COLORS.BLACK['100'],
    },
    profileInfo: {
        marginHorizontal: 10,
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: COLORS.BLACK['100'],
    },
    imageElement: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 100,
    },
    createDropItem: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.BLACK['100'],
        marginBottom: -2,
    },
    loadingLayout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        // backgroundColor: COLORS.SHADE['100'],
        backgroundColor: COLORS.SHADE['100'],
    },
    userName: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 18,
        lineHeight: 25,
        color: COLORS.BLACK['900'],
    },
    karmaContainer: {
        paddingLeft: 6,
    },
    gridContainer: {
        paddingHorizontal: horizontalPadding - imagePadding,
    },
    templateCreateText: {
        color: COLORS.BLACK['600'],
        fontWeight: 'bold',
        fontSize: 14,
    },
    plainImageContainer: {
        padding: imagePadding,
    },
    imageContainer: {
        borderRadius: 5,
        shadowOffset: {
            width: 10,
            height: 10,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginBottom: 5,
    },
    uploadingMessage: {
        marginTop: 5,
    },
    dropImageContainer: {
        padding: imagePadding,
    },
    noDropsSplashStyle: {
        marginTop: -60,
    },
    loadingContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorCross: {
        fontSize: 36,
        lineHeight: 40,
        color: COLORS.RED['600'],
    },
})
