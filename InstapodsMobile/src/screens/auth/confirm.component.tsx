import React, { useState } from 'react'
import { StyleSheet, Keyboard } from 'react-native'
import { Layout, Button, Input, Text } from '@ui-kitten/components'
import { useSelector } from 'react-redux'
import { ROUTES } from '../../common/constants'
import { IReactNavigationPlug } from '../../types.any'
import { IReduxState } from '../../redux/state.redux'
import { Header } from '../../common/components/header.component'

type Props = {
    navigation: IReactNavigationPlug
}

const ConfirmScreen = ({ navigation }: Props) => {
    const [isLoading, setIsLoading] = useState(false)

    const [verificationCode, setVerificationCode] = useState('')

    const [error, setError] = useState('')

    const confirmationResult = useSelector(
        (state: IReduxState) => state.confirmationResult
    )

    const onEnteredCode = async () => {
        setIsLoading(true)
        try {
            await confirmationResult.confirm(verificationCode)
        } catch (err) {
            setError('Invalid confirmation code.')
            throw err
        } finally {
            setIsLoading(false)
        }
    }
    const isDisabled = isLoading || verificationCode.length === 0

    return (
        <Layout style={Styles.outer}>
            <Header
                onBack={() => navigation.navigate(ROUTES.SIGNUP_SCREEN)}
                title="Confirm number"
                alignment="start"
            />
            <Text category="h5">Enter the Code we sent to you</Text>
            <Layout style={Styles.inner}>
                <Input
                    placeholder="Confirmation Code"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    autoFocus={true}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    style={Styles.input}
                />
                <Button onPress={onEnteredCode} disabled={isDisabled}>
                    Confirm Code
                </Button>
                <Text style={Styles.errorText}>{error}</Text>
            </Layout>
        </Layout>
    )
}

const Styles = StyleSheet.create({
    outer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 50,
    },
    inner: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 50,
    },
    input: {
        marginTop: 15,
        marginBottom: 15,
    },
    errorText: {
        marginTop: 10,
        color: 'red',
    },
})

export default ConfirmScreen
