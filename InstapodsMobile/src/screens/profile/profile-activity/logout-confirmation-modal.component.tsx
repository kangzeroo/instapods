import React from 'react'
import { StyleSheet } from 'react-native'
import { Layout, Text, Button } from '@ui-kitten/components'
import { COLORS, FONTS } from '../../../styles'

const Styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 20,
        width: 300,
        justifyContent: 'space-between',
        borderRadius: 10,
    },
    warning: {
        fontSize: 18,
        lineHeight: 26,
        color: COLORS.BLACK['500'],
        justifyContent: 'center',
        textAlignVertical: 'center',
        alignSelf: 'flex-start',
        marginBottom: 30,
        flexWrap: 'wrap',
        fontWeight: 'bold',
        fontFamily: FONTS.FORMAL,
    },
})

type Props = {
    closeModal: () => void
    logout: () => void
}
const LogoutConfirmationModal = ({ logout }: Props) => {
    return (
        <Layout style={Styles.root}>
            <Text style={Styles.warning}>
                Are you sure you want to log out? You will be missed 😔
            </Text>
            <Button onPress={logout} size="large">
                LOG OUT
            </Button>
        </Layout>
    )
}

export default LogoutConfirmationModal
