import React, { useEffect, useState } from 'react'
import { StyleSheet, View, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { useQuery } from '@apollo/react-hooks'
import { useRoute } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import analytics from '@react-native-firebase/analytics'
import { Spinner, Layout, Text, Modal, Button } from '@ui-kitten/components'
import { ScrollView } from 'react-native-gesture-handler'
import { IReactNavigationPlug } from '../../../types.any'
import { VIEW_DROP_PREENGAGEMENT } from './pre-engagement.gql'
import ReviewDrop from '../review-drop/review-drop.component'
import {
    DROP_PREVIEW_TYPES,
    GOOGLE_ANALYTICS_ITEM_CATEGORIES,
} from '../../../common/analytics'
import { Header } from '../../../common/components/header.component'
import {
    QueryViewDropPreEngagementArgs,
    Drop_Fragment,
} from '../../../generated-types'
import {
    // TOGGLE_BOTTOM_BAR_VISIBLE,
    CHOOSE_DROP,
    SET_DROP_FUNCTIONALITY,
} from '../../../redux/actions.redux'
import Typewriter from '../../../common/components/typewriter.component'
import { COLORS } from '../../../styles'
import DropSnapshot from '../drop-snapshot/drop-snapshot.component'
import { IReduxState } from '../../../redux/state.redux'
import DropQuickPreview from './drop-pre-engagement-quickview.component'
import DismissKeyboardHOC from '../../../common/components/keyboard-dismiss-hoc.component'

const Styles = StyleSheet.create({
    safearea: {
        flex: 1,
        backgroundColor: COLORS.WHITE['100'],
    },
    layout: {
        flex: 1,
        // padding: 10,
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
    username: {
        marginVertical: 10,
    },
    leaveButton: {
        marginLeft: 10,
        marginTop: 10,
    },
    rowBetweenContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    scrollLayout: {
        flex: 1,
    },
    descText: { marginHorizontal: 10 },
    headerImage: {
        // flex: 1,
        // height: 400,
        width: '100%',
        aspectRatio: 1,
    },
    engageButton: {
        height: 50,
        margin: 10,
    },
    loadingLayout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
        paddingHorizontal: 10,
    },
    backdrop: {
        backgroundColor: COLORS.SHADE['100'],
    },
})

type Props = { navigation: IReactNavigationPlug }
const DropFullPreview = ({ navigation }: Props) => {
    const route: any = useRoute()
    const dispatch = useDispatch()
    const dropId = route?.params?.dropId
    const [isRefreshing, setIsRefreshing] = useState(false)
    const currentUser = useSelector((state: IReduxState) => state.userParams)
    const chosenDrop = useSelector((state: IReduxState) => state.currentDrop)
    const visible = useSelector(
        (state: IReduxState) => state.dropFunctionality.visible
    )
    useEffect(() => {
        analytics().logViewItem({
            item_id: dropId,
            item_name: DROP_PREVIEW_TYPES.FULL_PAGE,
            item_category: GOOGLE_ANALYTICS_ITEM_CATEGORIES.PREVIEW_DROP,
        })
    })

    const backButtonCallback = () => {
        navigation.goBack()
    }

    const queryArgs: QueryViewDropPreEngagementArgs = {
        dropId,
    }
    const { error, loading, data, refetch } = useQuery(
        VIEW_DROP_PREENGAGEMENT,
        {
            variables: queryArgs,
        }
    )
    // useEffect(() => {
    //     console.log('invisible')
    //     dispatch({
    //         type: TOGGLE_BOTTOM_BAR_VISIBLE,
    //         payload: false,
    //     })
    // })
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
                >{`${error.message}.  Click below to go back.`}</Text>
                <Button status="warning" onPress={backButtonCallback}>
                    Back
                </Button>
            </View>
        )
    }

    const {
        id,
        title,
        image,
        username,
        contentUrl,
        desc,
        droppedDate,
        userId,
        userImage,
        userKarma,
    } = data?.viewDropPreEngagement

    const isUserDrop = currentUser.id === userId

    const dropFragment: Drop_Fragment = {
        id,
        username,
        userId,
        contentUrl,
        droppedDate,
        desc,
        title,
        image,
    }

    const returnPageTitle = () => {
        if (isUserDrop) {
            return 'Review Drop'
        }
        return 'View Drop'
    }

    if (chosenDrop !== id && currentUser.id === userId) {
        dispatch({ type: CHOOSE_DROP, payload: id })
    }

    const closeModal = () => {
        dispatch({
            type: SET_DROP_FUNCTIONALITY,
            payload: { visible: false, drop: null, type: null },
        })
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

    return (
        <SafeAreaView key={`drop-fullview-${dropId}`} style={Styles.safearea}>
            <Header title={returnPageTitle()} onBack={backButtonCallback} />
            <ScrollView
                style={Styles.scrollLayout}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <DropSnapshot
                    dropItem={dropFragment}
                    dropperImage={userImage}
                    dropperKarma={userKarma}
                />
                {userId === currentUser.id && (
                    <ReviewDrop
                        navigation={navigation}
                        refreshing={isRefreshing}
                    />
                )}
            </ScrollView>
            {/* theres a minor bug with the below modal... it is replicated in podView, for some reason the one in podView still 
                renders. It works out though because it renders below this one, so only one gets pressed. But nontheless, the second is there when 
                it really shouldnt be :(. also engageDrop DOES NOT get called twice thank god --- tangris 
            */}
            <Modal
                backdropStyle={Styles.backdrop}
                onBackdropPress={closeModal}
                visible={visible}
            >
                <DismissKeyboardHOC>
                    <DropQuickPreview />
                </DismissKeyboardHOC>
            </Modal>
        </SafeAreaView>
    )
}

export default DropFullPreview
