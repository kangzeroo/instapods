import React from 'react'
import { StyleSheet, Linking } from 'react-native'
import { Layout, Text, Button } from '@ui-kitten/components'
import { COLORS } from '../../../styles'
import { GETTING_STARTED_GUIDE_URL } from '../../../common/constants'

const Styles = StyleSheet.create({
    root: {
        flex: 1,
        alignSelf: 'center',
        paddingTop: 100,
        textAlign: 'center',
        backgroundColor: COLORS.TRANSPARENT['0'],
    },
    info: {
        textAlign: 'center',
        marginBottom: 30,
        fontSize: 16,
    },
    buttonStyle: {
        borderRadius: 15,
        marginTop: 30,
        marginBottom: 10,
    },
    iconStyle: {
        fontSize: 60,
        lineHeight: 64,
        textAlign: 'center',
    },
})

const NoDropsSplash = ({ goToNewDrop }: { goToNewDrop: () => void }) => {
    return (
        <Layout style={Styles.root}>
            <Text style={Styles.iconStyle}>⛳️</Text>
            <Button onPress={goToNewDrop} style={Styles.buttonStyle}>
                Drop a Post
            </Button>
            <Button
                appearance="ghost"
                onPress={() =>
                    Linking.openURL(
                        `${GETTING_STARTED_GUIDE_URL}?utm_source=app-profile-activity-page`
                    )
                }
            >
                Getting Started Guide
            </Button>
        </Layout>
    )
}

export default NoDropsSplash
