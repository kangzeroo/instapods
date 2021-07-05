import React from 'react'
import { StyleSheet } from 'react-native'
import { Layout, Text } from '@ui-kitten/components'

const Styles = StyleSheet.create({
    root: {
        flex: 1,
    },
})

const StandardComponent = () => {
    return (
        <Layout style={Styles.root}>
            <Text>StandardComponent</Text>
        </Layout>
    )
}

export default StandardComponent
