import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ErrorBoundary from 'react-native-error-boundary'
import ErrorSplashScreen from '../screens/error/error-splash-screen.component'
import LoginScreen from '../screens/auth/login.component'
import LoginHomeScreen from '../screens/auth/index.component'
// import SignupScreen from '../screens/auth/signup.component'
import ConfirmScreen from '../screens/auth/confirm.component'

import UnauthPodview from '../screens/pods/unauth-podview/unauth-podview.component'
import { ROUTES } from '../common/constants'

const Stack = createStackNavigator()

const LoggedOutSection = () => {
    return (
        <ErrorBoundary FallbackComponent={ErrorSplashScreen}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen
                    name={ROUTES.LOGIN_HOME_SCREEN}
                    component={LoginHomeScreen}
                />
                <Stack.Screen
                    name={ROUTES.LOGIN_SCREEN}
                    component={LoginScreen}
                />
                {/* <Stack.Screen
                    name={ROUTES.SIGNUP_SCREEN}
                    component={SignupScreen}
                /> */}
                <Stack.Screen
                    name={ROUTES.SIGNUP_SCREEN}
                    component={LoginScreen}
                />
                <Stack.Screen
                    name={ROUTES.CONFIRM_SCREEN}
                    component={ConfirmScreen}
                />
                <Stack.Screen
                    name={ROUTES.UNAUTH_JOIN_POD}
                    component={UnauthPodview}
                />
            </Stack.Navigator>
        </ErrorBoundary>
    )
}

export default LoggedOutSection
