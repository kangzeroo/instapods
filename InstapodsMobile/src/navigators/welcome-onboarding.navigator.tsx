import React from 'react'
import { StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import ErrorBoundary from 'react-native-error-boundary'
import ErrorSplashScreen from '../screens/error/error-splash-screen.component'
import { ROUTES } from '../common/constants'
import {
    WelcomeToInstapodsOnboarding,
    HowItWorksOnboarding,
    CommunityGuidelinesOnboarding,
    VerifyYourAccountOnboarding,
    InitialLoadingScreenOnboarding,
    NextStepsOnboarding,
} from '../screens/onboarding/welcome'
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
                    name={ROUTES.WELCOME_ONBOARDING.INITIAL_LOADING_SCREEN}
                    component={InitialLoadingScreenOnboarding}
                />
                <Stack.Screen
                    name={ROUTES.WELCOME_ONBOARDING.WELCOME}
                    component={WelcomeToInstapodsOnboarding}
                />
                <Stack.Screen
                    name={ROUTES.WELCOME_ONBOARDING.HOW_IT_WORKS}
                    component={HowItWorksOnboarding}
                />
                <Stack.Screen
                    name={ROUTES.WELCOME_ONBOARDING.RULES_OF_ENGAGEMENT}
                    component={CommunityGuidelinesOnboarding}
                />
                <Stack.Screen
                    name={ROUTES.WELCOME_ONBOARDING.VERIFY_ACCOUNT}
                    component={VerifyYourAccountOnboarding}
                />
                <Stack.Screen
                    name={ROUTES.WELCOME_ONBOARDING.NEXT_STEPS}
                    component={NextStepsOnboarding}
                />
            </Stack.Navigator>
        </ErrorBoundary>
    )
}

export default WelcomeOnboarding
