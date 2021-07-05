import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    View,
    StyleSheet,
    Image,
    TouchableHighlight,
    Linking,
} from 'react-native'
import analytics from '@react-native-firebase/analytics'
import { Text, Divider, Avatar } from '@ui-kitten/components'
import { WhiteSpace, Grid, Icon } from '@ant-design/react-native'
import { timestampToMoment } from '../../../common/utils'
import {
    INavIconElement,
    IImageCompatibilityPlug,
    IDropStorageItem,
    IDropFunctionality,
} from '../../../types.any'
import { isInteractionType } from '../async-storage.utility'
import { IReduxState } from '../../../redux/state.redux'
import { Drop_Fragment } from '../../../generated-types'
import { KarmaTag } from '../../../common/components/karma-tag.component'
import { COLORS } from '../../../common/styles'
import {
    MARKED_COMPLETE,
    DECLINE,
    INSTAGAM_URL,
} from '../../../common/constants'
import {
    DROP_PREVIEW_TYPES,
    GOOGLE_ANALYTICS_ITEM_CATEGORIES,
} from '../../../common/analytics'
import { SET_DROP_FUNCTIONALITY } from '../../../redux/actions.redux'

const Styles = StyleSheet.create({
    root: {
        margin: 10,
        marginBottom: 30,
        borderRadius: 10,
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        borderColor: COLORS.BLACK['200'],
        backgroundColor: COLORS.WHITE['100'],
        borderWidth: 1,
    },
    rowContainer: {
        flexDirection: 'row',
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    statusContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    buttonContainer: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    highlightStyle: {
        backgroundColor: '#fff',
    },
    usernameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
    },
    usernameText: {
        flex: 1,
        paddingLeft: 10,
        fontWeight: 'bold',
    },
    dropDateText: {
        marginLeft: 10,
        fontSize: 14,
        color: COLORS.BLACK['300'],
    },
    rowBetweenContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleStyle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    descText: {
        marginHorizontal: 10,
        fontSize: 16,
    },
    fullWidthHeaderImage: {
        width: '100%',
        aspectRatio: 1,
    },
    buttonText: {
        fontSize: 16,
        lineHeight: 20,
        color: COLORS.BLACK['300'],
        fontWeight: '500',
    },
    buttonIcon: {
        fontSize: 20,
        lineHeight: 20,
        paddingRight: 2,
    },
    buttonHighLight: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    rowItem: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
    },
    karmaContainer: {
        marginHorizontal: 8,
    },
    dropContentContainer: {
        paddingTop: 10,
        paddingBottom: 15,
    },
    statusText: {
        flex: 1,
    },
    flexContainer: {
        flex: 1,
    },
})

const profileAvatar = (img: IImageCompatibilityPlug, username: string) => {
    return (
        <TouchableHighlight
            style={Styles.highlightStyle}
            underlayColor="#ffffff00"
            onPress={() => {
                Linking.openURL(`${INSTAGAM_URL}${username}`)
            }}
        >
            <Avatar
                size="medium"
                source={img}
                width={120}
                height={120}
                borderRadius={100}
            />
        </TouchableHighlight>
    )
}

const CompletedDrop = () => (
    <View style={Styles.statusContainer}>
        <Icon name="check-circle" color="green" />
        <Text
            numberOfLines={1}
            style={Styles.statusText}
        >{` You have completed this drop`}</Text>
    </View>
)
const DeclinedDrop = () => (
    <View style={Styles.statusContainer}>
        <Icon name="close-circle" color="red" />
        <Text
            numberOfLines={1}
            style={Styles.statusText}
        >{`  You have declined to engage with this drop`}</Text>
    </View>
)

type Props = {
    dropItem: Drop_Fragment
    dropperImage: string
    dropperKarma: number
    // navigation: IReactNavigationPlug
}
const DropSnapshot = ({ dropItem, dropperImage, dropperKarma }: Props) => {
    const {
        id,
        username,
        title,
        image,
        contentUrl,
        desc,
        droppedDate,
        userId,
    } = dropItem

    const dispatch = useDispatch()
    const [listViewOpenedOnce, setListViewOpenedOnce] = useState<String[]>([]) // this is mirroring the same variable in drop-pre-engagement .... sorry for duplicated code.
    const currentUser = useSelector((state: IReduxState) => state.userParams)
    const avatarUrl = dropperImage || null
    const storageDropArray: Array<IDropStorageItem> = useSelector(
        (state: IReduxState) => state.storageDropArray
    )

    const dropImage = (img: IImageCompatibilityPlug) => {
        return <Image style={Styles.fullWidthHeaderImage} source={img} />
    }

    const openLinkToInstagramPost = () => {
        if (listViewOpenedOnce.indexOf(id) < 0) {
            setListViewOpenedOnce(listViewOpenedOnce.concat([id]))
        }
        analytics().logViewItem({
            item_id: id,
            item_name: DROP_PREVIEW_TYPES.QUICK_LIST,
            item_category: GOOGLE_ANALYTICS_ITEM_CATEGORIES.PREVIEW_DROP,
        })
        Linking.openURL(contentUrl)
    }

    const declineListView = () => {
        const reduxInput: IDropFunctionality = {
            visible: true,
            drop: dropItem,
            type: DECLINE,
        }
        dispatch({ type: SET_DROP_FUNCTIONALITY, payload: reduxInput })
    }
    const markCompleteListView = () => {
        const reduxInput: IDropFunctionality = {
            visible: true,
            drop: dropItem,
            type: MARKED_COMPLETE,
        }
        dispatch({ type: SET_DROP_FUNCTIONALITY, payload: reduxInput })
    }
    // console.log('drop snapshit storage: ', storageDropArray)
    // determines if drop is already declined
    const isDeclined: boolean = isInteractionType(
        id,
        [DECLINE],
        storageDropArray
    )
    // determines if the drop is completed already
    const isCompleted: boolean = isInteractionType(
        id,
        [MARKED_COMPLETE],
        storageDropArray
    )
    const isFinished: boolean = isDeclined || isCompleted
    const isUserDrop: boolean = currentUser.id === userId

    // puts a footer on each snapshot to emulate the "open", "complete", "decline" options
    const navList: Array<INavIconElement> = [
        {
            icon: 'folder-open',
            text: 'Open',
            disabled: false,
            onPress: openLinkToInstagramPost,
        },
        {
            icon: 'check-circle',
            text: 'Done',
            disabled: isFinished || isUserDrop,
            onPress: markCompleteListView,
        },
        {
            icon: 'close-circle',
            text: 'Decline',
            disabled: isFinished || isUserDrop,
            onPress: declineListView,
        },
    ]

    const IconMenu = () => (
        <Grid
            data={navList}
            columnNum={3}
            itemStyle={Styles.rowItem}
            hasLine={false}
            renderItem={(el: INavIconElement) => {
                if (el.disabled) {
                    return null
                }
                return (
                    <View style={Styles.buttonContainer}>
                        <TouchableHighlight
                            style={{
                                ...Styles.buttonHighLight,
                            }}
                            onPress={el.onPress}
                            disabled={el.disabled}
                            underlayColor={COLORS.BLACK['100']}
                        >
                            <View style={Styles.rowContainer}>
                                <Icon
                                    name={el.icon}
                                    style={{
                                        ...Styles.buttonText,
                                        ...Styles.buttonIcon,
                                    }}
                                />
                                <Text style={Styles.buttonText}>{el.text}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                )
            }}
        />
    )

    return (
        <View key={`drop-snapshot-${id}`} style={Styles.root}>
            <View style={Styles.usernameContainer}>
                <View style={Styles.headerContainer}>
                    {profileAvatar(avatarUrl, username)}
                    <View style={Styles.flexContainer}>
                        <TouchableHighlight
                            style={Styles.highlightStyle}
                            underlayColor="#ffffff00"
                            onPress={() => {
                                Linking.openURL(`${INSTAGAM_URL}${username}`)
                            }}
                        >
                            <Text style={Styles.usernameText} numberOfLines={1}>
                                {username}
                            </Text>
                        </TouchableHighlight>
                        <Text style={Styles.dropDateText}>
                            {timestampToMoment(droppedDate).fromNow()}
                        </Text>
                    </View>
                </View>
                <View style={Styles.karmaContainer}>
                    {KarmaTag(dropperKarma)}
                </View>
            </View>
            <Divider />
            {dropImage(image)}
            <Divider />
            <View style={Styles.dropContentContainer}>
                <View style={Styles.rowBetweenContainer}>
                    <Text style={Styles.titleStyle} numberOfLines={2}>
                        {title || ''}
                    </Text>
                </View>
                {/* <Image style={Styles.fullWidthHeaderImage} source={image} /> */}

                <Text style={Styles.descText} numberOfLines={3}>
                    {desc || ''}
                </Text>
            </View>

            {isFinished ? (
                <View>
                    {isCompleted && CompletedDrop()}
                    {isDeclined && DeclinedDrop()}

                    <WhiteSpace />
                </View>
            ) : null}
            <Divider />
            {IconMenu()}
            {/* <ReviewDropEngagement /> */}
        </View>
    )
}

export default DropSnapshot
