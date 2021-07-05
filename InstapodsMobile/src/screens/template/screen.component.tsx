import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import {
    Text,
    Divider,
    Layout,
    Icon,
    TopNavigation,
    TopNavigationAction,
} from '@ui-kitten/components'
import { IReactNavigationPlug } from '../../types.any'

const Styles = StyleSheet.create({
    safearea: {
        flex: 1,
    },
    layout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

type Props = { navigation: IReactNavigationPlug }
const ScreenTemplate = ({ navigation }: Props) => {
    const BackIcon = (style: object) => <Icon {...style} name="arrow-back" />
    return (
        <SafeAreaView style={Styles.safearea}>
            <TopNavigation
                title="Screen Template"
                alignment="center"
                leftControl={
                    <TopNavigationAction
                        icon={BackIcon}
                        onPress={() => navigation.goBack()}
                    />
                }
            />
            <Divider />
            <Layout style={Styles.layout}>
                <Text category="h1">SCREEN TEMPLATE</Text>
            </Layout>
        </SafeAreaView>
    )
}

export default ScreenTemplate
