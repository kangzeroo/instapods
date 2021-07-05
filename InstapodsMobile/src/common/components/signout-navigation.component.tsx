import React from 'react'
import { View } from 'react-native'
import auth from '@react-native-firebase/auth'
import { TopNavigation, TopNavigationAction, Icon } from '@ui-kitten/components'
import { IReactNavigationPlug } from '../../types.any'
import { ROUTES } from '../constants'

type SignOutNavProps = {
    navigation: IReactNavigationPlug
    signOutFunctionPrefix?: () => void
}

const SignOutNavigation = ({
    navigation,
    signOutFunctionPrefix = undefined,
}: SignOutNavProps) => {
    const SignoutIcon = (style: object) => (
        <Icon {...style} name="log-out-outline" />
    )

    const signOut = () => {
        if (signOutFunctionPrefix) {
            signOutFunctionPrefix()
        }
        navigation.navigate(ROUTES.LOGIN_SCREEN)
        auth().signOut()
    }

    return (
        <View>
            <TopNavigation
                alignment="start"
                rightControls={
                    <TopNavigationAction
                        icon={SignoutIcon}
                        onPress={() => signOut()}
                    />
                }
            />
        </View>
    )
}

export default SignOutNavigation
