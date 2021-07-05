import React from 'react'
import { StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import ErrorBoundary from 'react-native-error-boundary'
import ErrorSplashScreen from '../screens/error/error-splash-screen.component'
import { ROUTES } from '../common/constants'
import {
    StartPodOnboarding,
    InvitePeersOnboarding,
    KeepHealthyOnboarding,
} from '../screens/onboarding/create-pod'
import { IReactNavigationPlug } from '../types.any'

const Stack = createStackNavigator()

// eslint-disable-next-line
const Styles = StyleSheet.create({
    loadingLayout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

// eslint-disable-next-line
const WelcomeOnboarding = ({ navigation }: IReactNavigationPlug) => {
    return (
        <ErrorBoundary FallbackComponent={ErrorSplashScreen}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen
                    name={ROUTES.POD_ONBOARDING.START_POD}
                    component={StartPodOnboarding}
                />
                <Stack.Screen
                    name={ROUTES.POD_ONBOARDING.INVITE_PEERS}
                    component={InvitePeersOnboarding}
                />
                <Stack.Screen
                    name={ROUTES.POD_ONBOARDING.KEEP_HEALTHY}
                    component={KeepHealthyOnboarding}
                />
            </Stack.Navigator>
        </ErrorBoundary>
    )
}

export default WelcomeOnboarding
