import React from 'react'
import { StyleSheet } from 'react-native'
import { Layout, Text, Button } from '@ui-kitten/components'
import auth from '@react-native-firebase/auth'

const Styles = StyleSheet.create({
    layout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 30,
    },
    message: {
        fontSize: 16,
    },
    retry: {
        width: '100%',
        marginTop: 30,
        marginBottom: 10,
    },
})

type Props = {
    error: Error
    resetError: () => void
}
const ErrorSplashScreen = ({ error, resetError }: Props) => {
    return (
        <Layout style={Styles.layout}>
            <Text style={Styles.message}>{error.toString()}</Text>
            <Button style={Styles.retry} onPress={resetError}>
                Retry
            </Button>
            <Button appearance="ghost" onPress={() => auth().signOut()}>
                Sign Out
            </Button>
        </Layout>
    )
}

export default ErrorSplashScreen
