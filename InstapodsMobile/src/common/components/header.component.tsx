import React from 'react'
import { TopNavigation, Icon, TopNavigationAction } from '@ui-kitten/components'
import { View } from 'react-native'

type HeaderAction = {
    icon: string
    onPress: () => any
}

type HeaderProps = {
    onBack?: () => any
    title?: string
    action?: HeaderAction
    alignment?: 'start' | 'center' | undefined
}

export const Header = ({
    onBack,
    title,
    action,
    alignment = 'center',
}: HeaderProps) => {
    const BackIcon = (style: object) => (
        <Icon {...style} name="arrow-ios-back-outline" />
    )
    const generateIcon = (name: string) => <Icon name={name} />
    return (
        <TopNavigation
            title={title}
            alignment={alignment}
            leftControl={
                onBack ? (
                    <TopNavigationAction onPress={onBack} icon={BackIcon} />
                ) : (
                    <View />
                )
            }
            rightControls={
                action ? (
                    <TopNavigationAction
                        icon={() => generateIcon(action.icon)}
                        onPress={action.onPress}
                    />
                ) : (
                    <View />
                )
            }
        />
    )
}
