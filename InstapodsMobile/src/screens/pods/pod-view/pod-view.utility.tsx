import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import {
    Icon,
    Button,
    Avatar,
    Spinner,
    Divider,
    Text,
} from '@ui-kitten/components'
import { Result, Icon as AntdIcon } from '@ant-design/react-native'
import {
    IImageCompatibilityPlug,
    IReactNavigationPlug,
} from '../../../types.any'
import { COLORS } from '../../../common/styles'
import { ROUTES } from '../../../common/constants'

// here are just some random components

const iconTab = (
    title: string,
    tabName: string,
    badgeCount: number | null = null
) => (
    <View style={Styles.rowContainer}>
        {/* <Icon
            name={tabName}
            width={20}
            height={20}
            fill="#000"
            style={Styles.tabIcon}
        /> */}
        <Text>{`${badgeCount ? `${badgeCount} ` : ''}${title}`}</Text>
    </View>
)

export const NoDropMemberDrops = () => (
    <View style={Styles.memberDropContainer}>
        <Result
            title={<Text style={Styles.memberDropIcon}>📭</Text>}
            message={
                <Text style={Styles.memberDropText}>No new drops... yet</Text>
            }
        />
    </View>
)

export const returnSectionHeader = (
    sectionName: string,
    sendToNewDrop: () => void
) => (
    <View style={Styles.headerContainer}>
        <Text category="h5" style={Styles.gridTitle}>
            {sectionName}
        </Text>
        <Button
            appearance="ghost"
            status="basic"
            onPress={sendToNewDrop}
            // accessoryLeft={PlusIcon}
        >
            New Drop
        </Button>
    </View>
)

export const uploadingDropNotif = () => (
    <View>
        <Divider />
        <View style={Styles.loadingContainer}>
            <View style={Styles.loadingView}>
                <Spinner />
            </View>

            <Text>Uploading your drop...</Text>
        </View>
    </View>
)

export const uploadingDropErrorNotif = (navigation: IReactNavigationPlug) => (
    <TouchableOpacity
        onPress={() => {
            navigation.navigate(ROUTES.NEW_DROP)
        }}
    >
        <View>
            <Divider />
            <View style={Styles.loadingContainer}>
                <View style={Styles.loadingView}>
                    <Text style={Styles.redCross}>X</Text>
                </View>

                <Text>An error occured. Click to view.</Text>
            </View>
        </View>
    </TouchableOpacity>
)

export const successNotif = () => (
    <View>
        <Divider />
        <View style={Styles.loadingContainer}>
            <AntdIcon
                color="green"
                name="check-circle"
                style={Styles.successIcon}
            />

            <Text>Successfully added your drop!</Text>
        </View>
    </View>
)

export const profileAvatar = (img: IImageCompatibilityPlug) => {
    return (
        <Avatar
            size="medium"
            source={img}
            width={120}
            height={120}
            borderRadius={100}
        />
    )
}

export const AddDropButton = (onPress: () => void) => {
    return (
        <View style={Styles.buttonFAB}>
            <TouchableOpacity style={Styles.touchable} onPress={onPress}>
                <Text style={Styles.plusIcon}>+</Text>
            </TouchableOpacity>
        </View>
    )
}

export const ButtonFill = () => <View style={Styles.buttonFill} />

export const PlusIcon = (props: any) => <Icon {...props} name="star" />

export const tabs = (badgeCount: number | undefined) => [
    {
        title: iconTab('New', 'info-outline', badgeCount),
        sub: '1',
    },
    { title: iconTab('All', 'keypad-outline'), sub: '2' },
]

const Styles = StyleSheet.create({
    leaveButton: {
        marginLeft: 10,
        marginTop: 10,
    },

    inviteFriendText: {
        textAlign: 'center',
        marginHorizontal: 32,
        fontSize: 16,
    },
    rowContainer: {
        flexDirection: 'row',
    },
    tabIcon: {
        // lineHeight: 15
        marginRight: 4,
    },
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        display: 'flex',
        // justifyContent: 'space-between',
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        // backgroundColor: COLORS.BLUE['100'],
    },
    loadingView: {
        paddingRight: 10,
    },
    gridTitle: {
        backgroundColor: COLORS.WHITE['100'],
        padding: 10,
    },
    buttonContainer: {
        // width: 60,
        paddingVertical: 10,
        height: 60,
        position: 'relative',
    },
    buttonFAB: {
        position: 'absolute',
        bottom: 24,
        right: 18,
        width: 70,
        height: 70,
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 2,
    },
    touchable: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: COLORS.BLUE['500'],
        backgroundColor: COLORS.BLUE['500'],
    },
    buttonFill: {
        height: 50,
    },
    plusIcon: {
        fontSize: 42,
        lineHeight: 42,
        fontWeight: '600',
        color: COLORS.WHITE['100'],
    },
    successIcon: {
        marginRight: 6,
    },
    memberDropContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 600,
    },
    memberDropText: {
        fontSize: 18,
        lineHeight: 24,
        maxWidth: '70%',
        textAlign: 'center',
    },
    memberDropIcon: {
        fontSize: 60,
        lineHeight: 64,
    },
    redCross: {
        color: COLORS.RED['600'],
        fontSize: 18,
    },
})
