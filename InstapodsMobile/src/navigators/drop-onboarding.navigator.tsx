import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ErrorBoundary from 'react-native-error-boundary'
import ErrorSplashScreen from '../screens/error/error-splash-screen.component'
import { ROUTES } from '../common/constants'
import {
    DropYourPostOnboarding,
    PickPodsOnboarding,
    SharePostOnboarding,
} from '../screens/onboarding/drop-post'

const Stack = createStackNavigator()

const DropOnboarding = () => {
    return (
        <ErrorBoundary FallbackComponent={ErrorSplashScreen}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen
                    name={ROUTES.DROP_ONBOARDING.SHARE_POST}
                    component={SharePostOnboarding}
                />
                <Stack.Screen
                    name={ROUTES.DROP_ONBOARDING.PICK_PODS}
                    component={PickPodsOnboarding}
                />
                <Stack.Screen
                    name={ROUTES.DROP_ONBOARDING.DROP_POSTS}
                    component={DropYourPostOnboarding}
                />
            </Stack.Navigator>
        </ErrorBoundary>
    )
}

export default DropOnboarding
