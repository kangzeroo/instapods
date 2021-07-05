import React from 'react'
import { StyleSheet } from 'react-native'
import { Layout, Spinner, Text } from '@ui-kitten/components'

export const AppLoading = () => {
    return (
        <Layout style={Styles.loadingLayout}>
            <Spinner size="giant" />
        </Layout>
    )
}

const Styles = StyleSheet.create({
    loadingLayout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
