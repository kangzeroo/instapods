import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import auth from '@react-native-firebase/auth'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Layout, Button, Text } from '@ui-kitten/components'
// import { useDispatch } from 'react-redux'
import DismissKeyboardHOC from '../../common/components/keyboard-dismiss-hoc.component'
// import { TOGGLE_BOTTOM_BAR_VISIBLE } from '../../redux/actions.redux'
import { ROUTES } from '../../common/constants'
import { FONTS, COLORS } from '../../styles'
import { IReactNavigationPlug } from '../../types.any'
// import Typewriter from '../../common/components/typewriter.component'

type Props = {
    navigation: IReactNavigationPlug
}

const LoginHomeScreen = ({ navigation }: Props) => {
    // auth().signOut()
    // const dispatch = useDispatch()
    // const [isLoading, setIsLoading] = useState(false)

    // useEffect(() => {
    //     const unsubscribe = auth().onAuthStateChanged(userAccount => {
    //         setIsLoading(false)
    //         if (userAccount) {
    //             // setIsLoading(true)
    //             // setTimeout(() => {
    //             navigation.navigate(ROUTES.WELCOME_ONBOARDING.NAVIGATION)
    //             // dispatch({
    //             //     type: TOGGLE_BOTTOM_BAR_VISIBLE,
    //             //     payload: true,
    //             // })
    //             setIsLoading(false)
    //             // }, 4000)
    //         }
    //     })
    //     return unsubscribe
    // })
    useEffect(() => {
        if (auth().currentUser) {
            console.log('index - already logged in. pushing onwards')
            navigation.navigate(ROUTES.WELCOME_ONBOARDING.NAVIGATION)
        }
    })

    // if (isLoading) {
    //     return (
    //         <Layout style={Styles.loadingLayout}>
    //             <Typewriter />
    //         </Layout>
    //     )
    // }

    // eslint-disable-next-line no-shadow
    const EmailTab = ({ navigation }: { navigation: IReactNavigationPlug }) => {
        return (
            <Layout style={Styles.buttonContainer}>
                <Button
                    onPress={() => navigation.navigate(ROUTES.LOGIN_SCREEN)}
                    status="info"
                    size="large"
                    style={Styles.loginButton}
                >
                    LOGIN
                </Button>
                <TouchableOpacity
                    onPress={() => navigation.navigate(ROUTES.SIGNUP_SCREEN)}
                >
                    <Text style={Styles.signup}>SIGN UP</Text>
                </TouchableOpacity>
            </Layout>
        )
    }

    return (
        <DismissKeyboardHOC>
            <Layout style={Styles.outer}>
                <Layout style={Styles.socialLogin}>
                    <Text category="h1" style={Styles.brand}>
                        Instapods
                    </Text>
                    <EmailTab navigation={navigation} />
                </Layout>
            </Layout>
        </DismissKeyboardHOC>
    )
}

const Styles = StyleSheet.create({
    outer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'none',
    },
    socialLogin: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    brand: {
        marginBottom: 50,
        fontFamily: FONTS.LOGO_FONT,
        fontSize: 48,
        lineHeight: 100,
    },
    loadingLayout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButton: {
        paddingLeft: 50,
        paddingRight: 50,
        marginTop: 15,
        width: 200,
    },
    buttonContainer: {
        flexDirection: 'column',
    },
    errorText: {
        marginTop: 10,
        color: 'red',
    },
    signup: {
        color: COLORS.BLACK['700'],
        marginTop: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})

export default LoginHomeScreen
