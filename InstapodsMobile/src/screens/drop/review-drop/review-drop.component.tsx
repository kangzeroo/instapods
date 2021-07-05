import React, { useEffect, useRef } from 'react'
import { StyleSheet, BackHandler, View } from 'react-native'
import { Icon, List } from '@ant-design/react-native'
import { Text, Layout, Card, Spinner } from '@ui-kitten/components'
import { useQuery } from '@apollo/react-hooks'
import analytics from '@react-native-firebase/analytics'
import { useSelector, useDispatch } from 'react-redux'
import { timestampToMoment } from '../../../common/utils'
import {
    DROP_REVIEW_TYPES,
    GOOGLE_ANALYTICS_ITEM_CATEGORIES,
} from '../../../common/analytics'
import { REVIEW_DROP } from './review-drop.gql'
import { TOGGLE_BOTTOM_BAR_VISIBLE } from '../../../redux/actions.redux'
import { FONTS, COLORS } from '../../../styles'
import { IReduxState } from '../../../redux/state.redux'
import {
    DropResults,
    Engagement_Fragment,
    QueryViewMyDropResultsArgs,
} from '../../../generated-types'
import { IReactNavigationPlug } from '../../../types.any'

const allTag = 'all'

type Props = {
    navigation: IReactNavigationPlug
    refreshing: undefined | boolean
}
const ReviewDrop = ({ navigation, refreshing = false }: Props) => {
    const dropId = useSelector((state: IReduxState) => state.currentDrop)

    const dispatch = useDispatch()
    const backButtonCallback = () => {
        navigation.goBack()
        dispatch({
            type: TOGGLE_BOTTOM_BAR_VISIBLE,
            payload: true,
        })
    }
    useEffect(() => {
        analytics().logViewItem({
            item_id: dropId,
            item_name: DROP_REVIEW_TYPES.GENERIC_DROP_REVIEW,
            item_category: GOOGLE_ANALYTICS_ITEM_CATEGORIES.REVIEW_DROP,
        })
        BackHandler.addEventListener('hardwareBackPress', backButtonCallback)
    })

    const queryArgs: QueryViewMyDropResultsArgs = {
        dropId,
    }

    const { loading, error, data, refetch } = useQuery(REVIEW_DROP, {
        variables: queryArgs,
    })
    const prevRefreshingRef: any = useRef()
    useEffect(() => {
        prevRefreshingRef.current = refreshing
    })
    const prevRefreshing: boolean = prevRefreshingRef.current
    useEffect(() => {
        if (refreshing && !prevRefreshing) {
            console.log('refreshing review')
            refetch()
        }
    }, [refreshing, prevRefreshing, refetch])

    if (loading || !dropId) {
        return (
            <Layout style={Styles.loadingLayout}>
                <Spinner size="giant" />
            </Layout>
        )
    }
    if (error) {
        // this happens underneath the DropSnapshot, so dosent really make sense to add a back button
        return (
            <View style={Styles.errorview}>
                <Text category="h2" style={Styles.errortitle}>
                    Ouch 🤕
                </Text>
                <Text
                    style={Styles.errormessage}
                >{`We can't collect your drop history right now. ${error?.message}`}</Text>
            </View>
        )
    }
    const { engagements }: DropResults = data?.viewMyDropResults || {
        engagements: [],
    } // might want to make a new query

    const returnItemArr = (engTag: string) => {
        const filteredData = engagements.filter(f => {
            // const filteredData = [].filter(f => {
            if (engTag === allTag) {
                return true
            }
            return f.interactionType === engTag
        })
        if (filteredData.length === 0) {
            return <NoResult />
        }
        // also sort it by "timestamp" to display most recent first
        filteredData.sort(
            (a: Engagement_Fragment, b: Engagement_Fragment) =>
                timestampToMoment(b.timestamp).valueOf() -
                timestampToMoment(a.timestamp).valueOf()
        )

        return filteredData.map((eng: Engagement_Fragment) => (
            <View style={Styles.cardWrapper}>
                <Card key={eng.id} style={Styles.engagementCard}>
                    <Layout style={Styles.cardContent}>
                        <View style={Styles.cardTextContent}>
                            <Text
                                category="h6"
                                numberOfLines={1}
                                style={Styles.headerText}
                            >{`@ ${eng.engagerUsername}`}</Text>
                            <Text
                                style={Styles.engagementAction}
                                numberOfLines={3}
                            >
                                {`${returnReadableInteractionType(
                                    eng.interactionType
                                )} your drop ${timestampToMoment(
                                    eng.timestamp
                                ).fromNow()}. ${eng.contents}`}
                            </Text>
                        </View>
                        {returnKarmaUpdateIcon(eng.interactionType)}
                    </Layout>
                </Card>
            </View>
        ))
    }
    return (
        <View>
            <List>{returnItemArr(allTag)}</List>
        </View>
    )
}

export default ReviewDrop

// -------------- misc components ------------------

const returnReadableInteractionType = (key: string) => {
    return key in EngagementConstants ? EngagementConstants[key].humanTag : key
}

const returnKarmaUpdateIcon = (key: string) => {
    const value = returnInteractionValue(key)
    const returnIconName = () => {
        if (value > 0) {
            return 'rise'
        }
        if (value < 0) {
            return 'fall'
        }
        return 'check'
    }
    const returnSuffix = () => {
        if (value > 0) {
            return '+'
        }
        return ''
    }
    const iconColor = () => {
        if (value > -1) {
            return 'green'
        }
        return 'red'
    }
    return (
        <View style={Styles.karmaContainer}>
            <Icon name={returnIconName()} size="lg" color={iconColor()} />

            <Text style={Styles.karmaTextFont}>
                {`${returnSuffix()} ${value}`}
            </Text>
        </View>
    )
}

const NoResult = () => {
    return (
        <Layout style={Styles.noResultLayout}>
            <Text>
                This drop has not received any engagements yet! Check back in a
                few minutes.
            </Text>
        </Layout>
    )
}

// -------------- constants ------------------

/**
 * This returns a karma update balue for the interactionType
 * @important this is copied from backend, so if you change anything please do so in the front end as well in `src/constants.ts`
 */
const returnInteractionValue = (interactionType: string) => {
    return interactionType in EngagementConstants
        ? EngagementConstants[interactionType].karmaValue
        : 1 // default to 1 if not in
}

/**
 * maps the backend "InteractionType" to a human "readable" form - used currently in review-drop.component.tsx
 * @important KEYS are copied from backend: src/contants.js
 * ... or suggest a way to share these between front / back ;)
 */
const EngagementConstants: {
    [key: string]: { [key: string]: string | number }
} = {
    LIKE: {
        humanTag: 'Liked',
        simpleTag: 'likes',
        karmaValue: 1,
        icon: 'like',
    },
    COMMENT: {
        humanTag: 'Commented on',
        simpleTag: 'comments',
        karmaValue: 1,
        icon: 'message',
    },
    SHARE: {
        humanTag: 'Shared',
        simpleTag: 'shares',
        karmaValue: 1,
        icon: 'share-alt',
    },
    BOOKMARK: {
        humanTag: 'Bookmarked',
        simpleTag: 'bookmarks',
        karmaValue: 1,
        icon: 'save',
    },
    ACCEPT: {
        humanTag: 'Accepted',
        simpleTag: 'accepted',
        karmaValue: 1,
        icon: 'check-circle',
    },
    DECLINE: {
        humanTag: 'Declined',
        simpleTag: 'declined',
        karmaValue: -1,
        icon: 'close-circle',
    },
    MARKED_COMPLETE: {
        humanTag: 'Completed',
        simpleTag: 'finished',
        karmaValue: 1,
        icon: 'file-done',
    },
    OPENED_FROM_APP: {
        humanTag: 'Opened',
        simpleTag: 'opened',
        karmaValue: 1,
        icon: 'folder-open',
    },
}

const Styles = StyleSheet.create({
    loadingLayout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    engagementCard: {
        borderRadius: 10,
        justifyContent: 'center',
        alignContent: 'flex-start',
        textAlignVertical: 'center',
        // marginBottom: 10,
        marginTop: 10,
        // backgroundColor: COLORS.TRANSPARENT['800'],
        // backgroundColor: COLORS.BLACK['100'],
    },
    cardWrapper: {
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginVertical: 10,
        marginHorizontal: 10,
    },
    headerText: {
        flex: 1,
        fontFamily: FONTS.FORMAL,
        textTransform: 'uppercase',
        fontSize: 14,
        color: COLORS.BLACK['500'],
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
        paddingTop: 8,
        overflow: 'hidden',
    },
    engagementAction: {
        fontFamily: FONTS.FORMAL,
        color: COLORS.BLACK['400'],
        fontSize: 14,
        fontWeight: '600',
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: COLORS.TRANSPARENT['100'],
        // backgroundColor: COLORS.BLACK['100'],
    },
    karmaContainer: {
        flex: 0,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingLeft: 5,
    },
    karmaTextFont: {
        fontSize: 20,
        alignSelf: 'center',
        marginTop: 7,
    },
    cardTextContent: {
        flex: 1,
    },
    noResultLayout: {
        flex: 1,
        padding: 20,
        textAlign: 'center',
    },
})
