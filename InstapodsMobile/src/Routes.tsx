import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import LoggedOutSection from './navigators/loggedout.navigator'
import LoggedInSection from './navigators/loggedin.navigator'
import WelcomeOnboarding from './navigators/welcome-onboarding.navigator'
import DropOnboarding from './navigators/drop-onboarding.navigator'
import PodOnboarding from './navigators/pod-onboarding.navigator'
import { navigationRef } from './navigators/navigation.ref'
import { ROUTES } from './common/constants'
import JoinPodScreen from './screens/pods/join-pod/join-pod.component'

const Stack = createStackNavigator()

const AppNavigator = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: false,
                }}
            >
                <Stack.Screen
                    name={ROUTES.LOGGED_OUT_SECTION}
                    component={LoggedOutSection}
                />
                <Stack.Screen
                    name={ROUTES.LOGGED_IN_SECTION}
                    component={LoggedInSection}
                />
                <Stack.Screen
                    name={ROUTES.WELCOME_ONBOARDING.NAVIGATION}
                    component={WelcomeOnboarding}
                />
                <Stack.Screen
                    name={ROUTES.DROP_ONBOARDING.NAVIGATION}
                    component={DropOnboarding}
                />
                <Stack.Screen
                    name={ROUTES.POD_ONBOARDING.NAVIGATION}
                    component={PodOnboarding}
                />
                <Stack.Screen
                    key={ROUTES.JOIN_POD}
                    name={ROUTES.JOIN_POD}
                    component={JoinPodScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator
