import React from 'react'
// import { Icon } from '@ui-kitten/components'
import { Icon } from '@ant-design/react-native'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS } from '../styles'

export const KarmaTag = (karmaValue: number) => (
    <View style={Styles.karmaContainer}>
        <Icon name="heart" style={Styles.karmaIcon} />
        <Text style={Styles.karmaNumber}>{karmaValue}</Text>
    </View>
)

const Styles = StyleSheet.create({
    karmaContainer: {
        flexDirection: 'row',
    },
    karmaNumber: {
        color: COLORS.BLACK['300'],
        fontSize: 14,
        lineHeight: 26,
    },
    karmaIcon: {
        color: COLORS.GREEN['500'],
        fontSize: 26,
        marginRight: 4,
    },
})
