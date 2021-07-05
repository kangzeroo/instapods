import React, { useEffect, useState } from 'react'
import { StyleSheet, BackHandler, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import {
    Input,
    Layout,
    Icon,
    TopNavigation,
    TopNavigationAction,
    Divider,
} from '@ui-kitten/components'
import { useDispatch } from 'react-redux'
import { TOGGLE_BOTTOM_BAR_VISIBLE } from '../../../redux/actions.redux'
import { IReactNavigationPlug } from '../../../types.any'
import PodsDiscoverResults from './pods-discover-results.component'

const Styles = StyleSheet.create({
    safearea: {
        flex: 1,
    },
    layout: {
        flex: 1,
        padding: 10,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        minHeight: '100%',
    },
    search: {},
})

type Props = {
    navigation: IReactNavigationPlug
    doneSearchingCallback: () => void
    closeSearchResults: () => void
}
const DiscoverPodsScreen = ({ navigation }: Props) => {
    const [searchSlug, setSearchSlug] = useState('')
    const [triggeredSearch, setTriggeredSearch] = useState(false)
    const dispatch = useDispatch()
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () =>
            navigation.goBack()
        )
    })
    const setSlugSearch = (v: string) => {
        setSearchSlug(v.toLowerCase().replace(new RegExp(' ', 'g'), ''))
    }
    const backButtonCallback = () => {
        navigation.goBack()
        dispatch({
            type: TOGGLE_BOTTOM_BAR_VISIBLE,
            payload: true,
        })
    }
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', backButtonCallback)
    })
    const renderIcon = (style: object) => {
        if (triggeredSearch) {
            return <Icon {...style} name="backspace-outline" />
        }
        return <Icon {...style} name="search-outline" />
    }
    const BackIcon = (style: object) => <Icon {...style} name="arrow-back" />
    const iconPressed = () => {
        if (triggeredSearch) {
            setTriggeredSearch(false)
        } else {
            setTriggeredSearch(true)
        }
    }
    const clearResults = () => {
        setSearchSlug('')
        setTriggeredSearch(false)
    }
    return (
        <SafeAreaView>
            <TopNavigation
                title="Search by Pod Name"
                alignment="center"
                leftControl={
                    <TopNavigationAction
                        icon={BackIcon}
                        onPress={backButtonCallback}
                    />
                }
            />
            <Divider />
            <Layout style={Styles.layout}>
                {!triggeredSearch && (
                    <Input
                        autoCorrect={false}
                        value={searchSlug}
                        placeholder="@"
                        onChangeText={setSlugSearch}
                        onSubmitEditing={() => {
                            Keyboard.dismiss()
                            setTriggeredSearch(true)
                        }}
                        label="Search by @podname"
                        icon={renderIcon}
                        onIconPress={iconPressed}
                        size="large"
                        style={Styles.search}
                        disabled={triggeredSearch}
                    />
                )}
                {triggeredSearch ? (
                    <PodsDiscoverResults
                        slug={searchSlug}
                        navigation={navigation}
                        clearResults={clearResults}
                    />
                ) : null}
            </Layout>
        </SafeAreaView>
    )
}

export default DiscoverPodsScreen
