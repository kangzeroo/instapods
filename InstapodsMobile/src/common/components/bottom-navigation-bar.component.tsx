import React, { useState, useEffect } from 'react'
import {
    Icon,
    BottomNavigation,
    BottomNavigationTab,
} from '@ui-kitten/components'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import ErrorBoundary from 'react-native-error-boundary'
import { useSelector, useDispatch } from 'react-redux'
// import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native'
import ErrorSplashScreen from '../../screens/error/error-splash-screen.component'
import ActivityScreen from '../../screens/profile/profile-activity/profile-activity.component'
import PodsListScreen from '../../screens/pods/pods-list/pods-list.component'
import CreatePodScreen from '../../screens/pods/create-pod/create-pod.component'
import DropFullPreview from '../../screens/drop/drop-pre-engagement/drop-pre-engagement-fullview.component'
import { ROUTES } from '../constants'
import { IReactNavigationPlug } from '../../types.any'
import { IReduxState } from '../../redux/state.redux'
import { TOGGLE_BOTTOM_BAR_VISIBLE } from '../../redux/actions.redux'

import HelpFloorScreen from '../../screens/onboarding/help-floor/help-floor.component'
import NewDropScreen from '../../screens/drop/new-drop/new-drop.component'
import ReviewDropScreen from '../../screens/drop/review-drop/review-drop.component'
import PodViewScreen from '../../screens/pods/pod-view/pod-view.component'
import ManagePodScreen from '../../screens/pods/manage-pod/manage-pod.component'
import DiscoverPodsScreen from '../../screens/pods/pods-discover/pods-discover.component'

type BottomTabBarProps = {
    navigation: IReactNavigationPlug
    state: any
}

const BottomTab = createBottomTabNavigator()
const Stack = createStackNavigator()

const Styles = StyleSheet.create({
    bottomNavTab: {
        paddingBottom: 20,
        paddingTop: 5,
    },
})

const navigationList = [
    {
        // icon: 'people-outline',
        icon: 'bell-outline',
        selectedIcon: 'bell',
        route: ROUTES.PODSLIST_SCREEN,
        component: PodsListScreen,
        title: 'PODS',
    },
    {
        icon: 'person-outline',
        selectedIcon: 'person',
        route: ROUTES.PROFILE_ACTIVITY,
        component: ActivityScreen,
        title: 'PROFILE',
    },
]

export const BottomNavigationBar = ({
    navigation,
    state,
}: BottomTabBarProps) => {
    const dispatch = useDispatch()
    const [selectedIndex, setSelectedIndex] = useState(1)

    const currentRoute = useSelector(
        (reduxState: IReduxState) => reduxState.currentRoute
    )

    useEffect(() => {
        state.routeNames.forEach((routeName: string, index: number) => {
            if (routeName === currentRoute) {
                setSelectedIndex(index)
            }
        })
    }, [currentRoute, state.routeNames])

    const onSelect = (index: number) => {
        dispatch({
            type: TOGGLE_BOTTOM_BAR_VISIBLE,
            payload: true,
        })
        const theSelectedIndex = state.routeNames[index]
        navigation.navigate(theSelectedIndex)
        setSelectedIndex(index)
    }

    const generateIcon = (
        icon: string,
        selectedIcon: string,
        isSelected: boolean
    ) => <Icon name={isSelected ? selectedIcon : icon} />

    return (
        <BottomNavigation
            appearance="noIndicator"
            selectedIndex={selectedIndex}
            onSelect={onSelect}
        >
            {navigationList.map(({ icon, selectedIcon, title }, i) => (
                <BottomNavigationTab
                    key={title}
                    icon={() =>
                        generateIcon(icon, selectedIcon, selectedIndex === i)
                    }
                    title={title}
                    style={Styles.bottomNavTab}
                />
            ))}
        </BottomNavigation>
    )
}

export const BottomBarNavigator = ({
    bottomBarVisible,
}: {
    bottomBarVisible: boolean
}) => {
    return (
        <ErrorBoundary FallbackComponent={ErrorSplashScreen}>
            <BottomTab.Navigator
                tabBar={props => {
                    if (bottomBarVisible) {
                        return <BottomNavigationBar {...props} />
                    }
                    return null
                }}
                tabBarOptions={{
                    keyboardHidesTabBar: true,
                }}
            >
                {navigationList.map(({ route, component }) => (
                    <Stack.Screen
                        key={route}
                        name={route}
                        component={component}
                    />
                ))}
                <Stack.Screen
                    key={ROUTES.HELP_FLOOR}
                    name={ROUTES.HELP_FLOOR}
                    component={HelpFloorScreen}
                />
                <Stack.Screen
                    key={ROUTES.CREATEPOD_SCREEN}
                    name={ROUTES.CREATEPOD_SCREEN}
                    component={CreatePodScreen}
                />
                <Stack.Screen
                    key={ROUTES.PODVIEW_SCREEN}
                    name={ROUTES.PODVIEW_SCREEN}
                    component={PodViewScreen}
                />
                <Stack.Screen
                    key={ROUTES.MANAGEPOD_SCREEN}
                    name={ROUTES.MANAGEPOD_SCREEN}
                    component={ManagePodScreen}
                />
                <Stack.Screen
                    key={ROUTES.NEW_DROP}
                    name={ROUTES.NEW_DROP}
                    component={NewDropScreen}
                />
                <Stack.Screen
                    key={ROUTES.REVIEW_DROP}
                    name={ROUTES.REVIEW_DROP}
                    component={ReviewDropScreen}
                />
                <Stack.Screen
                    key={ROUTES.DISCOVER_PODS}
                    name={ROUTES.DISCOVER_PODS}
                    component={DiscoverPodsScreen}
                />
                <Stack.Screen
                    key={ROUTES.PREVIEW_DROP}
                    name={ROUTES.PREVIEW_DROP}
                    component={DropFullPreview}
                />
            </BottomTab.Navigator>
        </ErrorBoundary>
    )
}
