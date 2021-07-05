import React from 'react'
import { StyleSheet, Linking } from 'react-native'
import { Layout, Text, Button } from '@ui-kitten/components'
import { HOW_TO_FIND_PODS_URL } from '../../../common/constants'
import { COLORS } from '../../../styles'

const Styles = StyleSheet.create({
    root: {
        flex: 1,
        alignSelf: 'center',
        paddingTop: '15%',
        textAlign: 'center',
    },
    info: {
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 30,
        fontSize: 16,
    },
    orJoinOne: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.BLUE['500'],
    },
})

const NoPodsSplash = ({
    createPodOnboarding,
}: {
    createPodOnboarding: () => void
}) => {
    return (
        <Layout style={Styles.root}>
            <Text style={{ fontSize: 60, lineHeight: 64, textAlign: 'center' }}>
                🐚
            </Text>
            <Button
                onPress={createPodOnboarding}
                style={{ borderRadius: 15, marginTop: 30, marginBottom: 10 }}
            >
                Create an Instapod
            </Button>
            <Button
                appearance="ghost"
                onPress={() =>
                    Linking.openURL(
                        `${HOW_TO_FIND_PODS_URL}?utm_source=app-pods-list-page`
                    )
                }
                style={Styles.orJoinOne}
            >
                Or join existing Pods
            </Button>
        </Layout>
    )
}

export default NoPodsSplash
