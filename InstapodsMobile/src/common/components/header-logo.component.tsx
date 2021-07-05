import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Text } from '@ui-kitten/components'
import { FONTS, COLORS } from '../styles'

export const LogoHeader = () => {
    // const backIcon = () => <Icon name="arrow-ios-back" />
    // const moreIcon = () => <Icon name="more-vertical" />
    return (
        <View style={Styles.container}>
            <Text style={Styles.logo}>InstaPods</Text>
        </View>
    )
}

const Styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.WHITE['100'],
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: 50,
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
    },
    logo: {
        fontSize: 30,
        lineHeight: 45,
        fontFamily: FONTS.LOGO_FONT,
        textAlign: 'center',
    },
})
