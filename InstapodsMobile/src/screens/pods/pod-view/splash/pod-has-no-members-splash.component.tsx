import React from 'react'
import { StyleSheet, Linking } from 'react-native'
import { Layout, Text, Button } from '@ui-kitten/components'
import { HOW_TO_FIND_PODS_URL } from '../../../../common/constants'
import { COLORS } from '../../../../styles'

const Styles = StyleSheet.create({
    root: {
        flex: 1,
        alignSelf: 'center',
        paddingTop: 200,
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

const PodNoMembersSplash = ({
    setShowInviteModal,
}: {
    setShowInviteModal: () => void
}) => {
    return (
        <Layout style={Styles.root}>
            <Text style={{ fontSize: 70, lineHeight: 74, textAlign: 'center' }}>
                🪂
            </Text>
            <Button
                onPress={setShowInviteModal}
                style={{ borderRadius: 10, marginTop: 30, marginBottom: 10 }}
            >
                Invite Friends to Pod
            </Button>
        </Layout>
    )
}

export default PodNoMembersSplash
