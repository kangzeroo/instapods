import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View, Keyboard, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { Text, Divider, Layout, Button, Input } from '@ui-kitten/components'
import { useMutation } from '@apollo/react-hooks'
import { useSelector, useDispatch } from 'react-redux'
import { WhiteSpace } from '@ant-design/react-native'
import DismissKeyboardHOC from '../../../common/components/keyboard-dismiss-hoc.component'
import { IReactNavigationPlug } from '../../../types.any'
import { COLORS } from '../../../styles'
import { ROUTES } from '../../../common/constants'
import { SET_CURRENT_ROUTE } from '../../../redux/actions.redux'
import { IReduxState } from '../../../redux/state.redux'
import { VERIFY_ACCOUNT } from './verify-your-account.gql'
import { MutationVerifyAccountArgs } from '../../../generated-types'
import Typewriter from '../../../common/components/typewriter.component'

type Props = { navigation: IReactNavigationPlug }
const VerifyYourAccount = ({ navigation }: Props) => {
    const dispatch = useDispatch()
    const [isKeyboardActive, setIsKeyboardActive] = useState(false)
    const [username, setUsername] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [error, setError] = useState('')
    const [nRetry, setNRetry] = useState(0)

    const verificationCode = useSelector(
        (state: IReduxState) => state.userParams.verificationCode
    )

    const scrollViewRef = useRef(null)
    const scrollToBottom = () => {
        // this scrolls scroll view to bottom to not hide the hashtags when they are selecetded
        scrollViewRef?.current?.scrollToEnd({ animated: 'true' })
    }

    const writeUsername = (v: string) => {
        setUsername(v.toLowerCase())
    }
    const [
        verifyAccount,
        { loading: verificationLoading, error: verificationError },
    ] = useMutation(VERIFY_ACCOUNT)

    useEffect(() => {
        dispatch({
            type: SET_CURRENT_ROUTE,
            payload: ROUTES.WELCOME_ONBOARDING.NEXT_STEPS,
        })
    })

    useEffect(() => {
        setErrorMessage(
            (verificationError?.message || '')?.replace('GraphQL error: ', '')
        )
    }, [verificationError])

    const attemptAccountVerification = async () => {
        // eslint-disable-next-line no-console
        console.log('run account verification for user ', username)
        setIsLoading(true)
        setError('')
        const mutationArgs: MutationVerifyAccountArgs = {
            username,
        }
        try {
            await verifyAccount({
                variables: mutationArgs,
                refetchQueries: ['getMyProfile'],
            })
            navigation.navigate(ROUTES.WELCOME_ONBOARDING.NEXT_STEPS)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    if (verificationError) {
        // eslint-disable-next-line no-console
        console.log('verify account error: ', verificationError)
        if (
            verificationError.message.toLowerCase().indexOf('network error:') >
            -1
        ) {
            // this is some bullshit error - has to do with instagram blocking apify and thus apify timing out on us....
            return (
                <View style={Styles.errorview}>
                    <Text category="h2" style={Styles.errortitle}>
                        Ouch 🤕
                    </Text>
                    <Text style={Styles.errormessage}>
                        We&apos;re having trouble reading your instagram account
                        😅. That&apos;s OK, please try again.
                    </Text>
                    {nRetry > 1 && (
                        <>
                            <Text style={Styles.errorText}>
                                * If this problem persists, please wait a couple
                                of minutes. Thank you for your patience 😘
                            </Text>
                            <WhiteSpace />
                            <WhiteSpace />
                        </>
                    )}
                    <Button
                        status="warning"
                        onPress={() => {
                            attemptAccountVerification()
                            setErrorMessage('')
                            setNRetry(nRetry + 1)
                        }}
                    >
                        Retry
                    </Button>
                </View>
            )
        }
    }

    if (errorMessage) {
        return (
            <View style={Styles.errorview}>
                <Text category="h2" style={Styles.errortitle}>
                    Ouch 🤕
                </Text>
                <Text
                    style={Styles.errormessage}
                >{`${errorMessage}.\nLet's go back a step...`}</Text>
                <Button
                    status="warning"
                    onPress={() => {
                        // navigation.goBack()
                        setErrorMessage('')
                    }}
                >
                    Back
                </Button>
            </View>
        )
    }

    const inputOnFocus = () => {
        // show the keyboard filler so that hashtags are not covered by keyboard
        setIsKeyboardActive(true)
        // scroll to the end of the scrollview
        setTimeout(() => scrollToBottom(), 500)
    }

    return (
        <DismissKeyboardHOC>
            <SafeAreaView style={Styles.safearea}>
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={Styles.scrollViewContainer}
                >
                    <Divider />
                    <Layout style={Styles.layout}>
                        <Text style={Styles.heading} category="h1">
                            VERIFY YOUR ACCOUNT
                        </Text>
                        <Text style={Styles.paragraph}>
                            {`Add #${verificationCode} to your bio to verify your account. You can change it back immediately after verification.`}
                        </Text>
                        <Input
                            value={username}
                            autoCorrect={false}
                            placeholder="username"
                            onFocus={inputOnFocus}
                            onBlur={() => setIsKeyboardActive(false)}
                            onChangeText={writeUsername}
                            label="Enter your Instagram username"
                            onSubmitEditing={() => Keyboard.dismiss()}
                            style={Styles.input}
                            maxLength={30}
                            size="large"
                        />
                        <Text style={Styles.errorText}>
                            {error.split(': ')[1]}
                        </Text>
                    </Layout>
                    {isKeyboardActive && <View style={Styles.keyboardFill} />}
                </ScrollView>
                <View style={Styles.buttonBar}>
                    {username && username.length ? (
                        <>
                            {verificationLoading || isLoading ? (
                                <View style={Styles.spinnerWrap}>
                                    <Text>This may take a minute...</Text>
                                    <WhiteSpace />
                                    <Typewriter isInline={true} />
                                </View>
                            ) : (
                                <Button
                                    onPress={attemptAccountVerification}
                                    style={Styles.next}
                                >
                                    Verify
                                </Button>
                            )}
                        </>
                    ) : null}
                </View>
            </SafeAreaView>
        </DismissKeyboardHOC>
    )
}

const Styles = StyleSheet.create({
    safearea: {
        flex: 1,
        backgroundColor: COLORS.WHITE['100'],
    },
    errorview: {
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        alignContent: 'center',
        textAlign: 'center',
    },
    errortitle: {
        textAlign: 'left',
    },
    errormessage: {
        fontSize: 20,
        lineHeight: 25,
        textAlign: 'left',
        marginVertical: 20,
    },
    keyboardFill: {
        height: 220,
    },
    layout: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        textAlign: 'left',
        paddingTop: 50,
        paddingHorizontal: 30,
    },
    paragraph: {
        marginTop: 30,
        fontSize: 20,
        fontWeight: '500',
        color: COLORS.BLACK['500'],
        lineHeight: 25,
        marginRight: 30,
    },
    buttonBar: {
        flexDirection: 'row',
        padding: 20,
    },
    heading: {
        textAlign: 'left',
    },
    next: {
        width: '100%',
    },
    instructions: {
        marginVertical: 20,
        fontSize: 20,
        lineHeight: 24,
    },
    input: {
        marginTop: 50,
    },
    spinnerWrap: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollViewContainer: {
        // minHeight: '100%',
        justifyContent: 'space-between',
    },
    errorText: {
        color: 'red',
        marginTop: 20,
    },
})

export default VerifyYourAccount
