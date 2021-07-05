import React, { useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Layout, Button, Text, Divider } from '@ui-kitten/components'
import appleAuth, {
    AppleButton,
} from '@invertase/react-native-apple-authentication'
import DismissKeyboardHOC from '../../common/components/keyboard-dismiss-hoc.component'
import { ROUTES } from '../../common/constants'
import { FONTS, COLORS } from '../../styles'
import { IReactNavigationPlug } from '../../types.any'
import { Header } from '../../common/components/header.component'
import { loginWithGoogle, onAppleButtonPress } from '../../common/auth/utils'

type Props = {
    navigation: IReactNavigationPlug
}

const LoginScreen = ({ navigation }: Props) => {
    // const [areaCode, setAreaCode] = useState('+1')
    // const [phoneNumber, setPhoneNumber] = useState('')
    const [error, setError] = useState('')
    const [loginEnabled, setLoginEnabled] = useState(true)

    // const onEnteredPhone = async () => {
    //     setIsLoading(true)
    //     try {
    //         const confirmation = await auth().signInWithPhoneNumber(
    //             areaCode + phoneNumber
    //         )
    //         // eslint-disable-next-line react/prop-types
    //         navigation.navigate(ROUTES.CONFIRM_SCREEN)
    //         dispatch({
    //             type: SET_CONFIRMATION_RESULTS,
    //             payload: confirmation,
    //         })
    //     } catch (err) {
    //         console.log(err)
    //         setError('Invalid format.')
    //     } finally {
    //         setIsLoading(false)
    //     }
    // }

    const sendToOnBoarding = () => {
        navigation.navigate(ROUTES.WELCOME_ONBOARDING.NAVIGATION)
    }

    const EmailTab = () => {
        const onEnteredGmail = async () => {
            if (!loginEnabled) {
                // eslint-disable-next-line no-console
                console.log('not enabled')
                return
            }
            setError('')
            setLoginEnabled(false)
            try {
                await loginWithGoogle()
                sendToOnBoarding()
            } catch (err) {
                // eslint-disable-next-line no-console
                console.log(err, err.code)
                if (err.code !== '-5' && err.code !== 'ASYNC_OP_IN_PROGRESS') {
                    // dont show -5 = user cancels, ASYNC_OP_IN_PROGRESS = user clicks the button twice
                    setError(err.message)
                }
            } finally {
                setLoginEnabled(true)
            }
        }

        return (
            <Layout style={Styles.tabContainer}>
                <Button
                    onPress={onEnteredGmail}
                    status="info"
                    size="large"
                    style={Styles.googleButton}
                >
                    Google Login
                </Button>
                <WhiteSpace />
            </Layout>
        )
    }

    const AppleSignIn = () => {
        const signInApple = async () => {
            if (!loginEnabled) {
                // eslint-disable-next-line no-console
                console.log('not enabled')
                return
            }
            setLoginEnabled(false)
            setError('')
            try {
                await onAppleButtonPress()
                sendToOnBoarding()
            } catch (err) {
                // eslint-disable-next-line no-console
                console.log(err, err.code)
                if (err.code !== '1001' && err.code !== '1000') {
                    // dont show 1001 = user cancels, 1000 = user clicks the button twice
                    setError(err.message)
                }
            } finally {
                setLoginEnabled(true)
            }
        }
        return (
            <Layout style={Styles.tabContainer}>
                {/* <Button
                    onPress={() => signInApple()}
                    status="info"
                    size="large"
                >
                    APPLE LOGIN
                </Button> */}
                <AppleButton
                    buttonStyle={AppleButton.Style.BLACK}
                    buttonType={AppleButton.Type.SIGN_IN}
                    style={Styles.appleButton}
                    onPress={() => signInApple()}
                />
                <WhiteSpace />
            </Layout>
        )
    }

    const WhiteSpace = () => <View style={Styles.whitespace} />

    return (
        <DismissKeyboardHOC>
            <ScrollView style={Styles.outer}>
                <Header
                    alignment="start"
                    title="Back"
                    onBack={() => navigation.navigate(ROUTES.LOGIN_HOME_SCREEN)}
                />
                <Layout style={Styles.navigationContainer}>
                    <Text category="h6">Login with Email</Text>
                    <WhiteSpace />
                    <EmailTab />
                    {appleAuth.isSupported ? (
                        <>
                            <Divider />
                            <WhiteSpace />
                            <Text category="h6">Login with Apple</Text>
                            <WhiteSpace />
                            <AppleSignIn />
                        </>
                    ) : null}

                    {/* <WhiteSpace />
                    <Text category="h6">Login with Phone</Text>
                    <Layout style={Styles.tabContainer}>
                        <Layout style={Styles.rowContainer}>
                            <Input
                                defaultValue={areaCode}
                                value={areaCode}
                                onChangeText={setAreaCode}
                                keyboardType="phone-pad"
                                style={Styles.areaCodeInput}
                                maxLength={4}
                                size="large"
                            />
                            <Input
                                defaultValue={phoneNumber}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                keyboardType="phone-pad"
                                style={Styles.phoneNumberInput}
                                maxLength={10}
                                size="large"
                            />
                        </Layout>
                        {phoneNumber.length > 6 && (
                            <View>
                                <Button
                                    onPress={onEnteredPhone}
                                    disabled={isLoading}
                                >
                                    Next
                                </Button>
                            </View>
                        )}
                    </Layout> */}
                    <View>
                        <Text style={Styles.errorText}>{error}</Text>
                    </View>
                </Layout>
            </ScrollView>
        </DismissKeyboardHOC>
    )
}

const Styles = StyleSheet.create({
    outer: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: COLORS.WHITE['100'],
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'none',
    },
    rowContainer: {
        flexDirection: 'row',
        width: '100%',
    },
    socialLogin: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    brand: {
        marginBottom: 50,
        fontFamily: FONTS.LOGO_FONT,
    },
    loadingLayout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButton: {
        paddingLeft: 50,
        paddingRight: 50,
    },
    navigationContainer: {
        width: '100%',
        padding: 30,
    },
    navigation: {
        color: 'black',
        // maxWidth: '100%',
    },
    tabContainer: {},
    areaCodeInput: {
        marginTop: 15,
        marginBottom: 15,
        width: '30%',
    },
    phoneNumberInput: {
        marginTop: 15,
        marginBottom: 15,
        width: '70%',
    },
    emailInput: {
        marginTop: 15,
        marginBottom: 15,
    },
    errorText: {
        color: 'red',
        padding: 30,
        backgroundColor: COLORS.WHITE['100'],
    },
    whitespace: {
        height: 25,
    },
    appleButton: {
        width: '100%',
        height: 45,
    },
    googleButton: {
        borderRadius: 6,
    },
})

export default LoginScreen
