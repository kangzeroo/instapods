import React from 'react'
import { StyleSheet } from 'react-native'
import { Layout, Text, Button } from '@ui-kitten/components'
import { useDispatch } from 'react-redux'
import { CHOOSE_DROP } from '../../../redux/actions.redux'
import { COLORS, FONTS } from '../../../styles'
import { ROUTES } from '../../../common/constants'
import { IReactNavigationPlug } from '../../../types.any'

const Styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 30,
        width: 300,
        borderRadius: 10,
    },
    headline: {
        fontFamily: FONTS.FORMAL,
        fontSize: 14,
        color: COLORS.BLACK['500'],
        justifyContent: 'center',
        textAlignVertical: 'center',
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        marginBottom: 15,
        flexWrap: 'wrap',
    },
    button: {
        marginTop: 20,
    },
})

type Props = {
    dropId: string
    closeModal: () => void
    navigation: IReactNavigationPlug
}
const YourOwnDropWarning = ({ dropId, navigation, closeModal }: Props) => {
    const dispatch = useDispatch()
    const viewEngagementResults = (): void => {
        dispatch({
            type: CHOOSE_DROP,
            payload: dropId,
        })
        navigation.navigate(ROUTES.REVIEW_DROP)
        closeModal()
    }
    return (
        <Layout style={Styles.root}>
            <Text style={Styles.headline}>
                This is your own dropped post. Would you like to go see the
                engagement results so far?
            </Text>
            <Button onPress={viewEngagementResults} style={Styles.button}>
                VIEW ENGAGEMENT
            </Button>
        </Layout>
    )
}

export default YourOwnDropWarning
