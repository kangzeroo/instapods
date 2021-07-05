import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Layout, Text, Button, Spinner } from '@ui-kitten/components'
import { COLORS, FONTS } from '../../../../styles'
import { PodAsMember } from '../../../../generated-types'

const Styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 20,
        width: 330,
        // height: 200,
        justifyContent: 'space-between',
        borderRadius: 15,
    },
    warning: {
        fontSize: 16,
        color: COLORS.BLACK['500'],
        justifyContent: 'center',
        textAlignVertical: 'center',
        alignSelf: 'flex-start',
        marginBottom: 15,
        flexWrap: 'wrap',
        fontWeight: 'bold',
        fontFamily: FONTS.FORMAL,
    },
    centerRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
})

type Props = {
    closeModal: () => void
    leavePod: () => void
    pod: PodAsMember
    loading: boolean
}
const PodLeaveModal = ({ leavePod, pod, loading = false }: Props) => {
    const LeavePodLoading = () => (
        <View style={Styles.centerRow}>
            <Spinner />
        </View>
    )
    return (
        <Layout style={Styles.root}>
            <Text style={Styles.warning}>
                {`Are you sure you want to leave \n@ ${pod.slug}?\n\nThe community will miss you ❤️`}
            </Text>
            {loading ? (
                LeavePodLoading()
            ) : (
                <Button onPress={leavePod} size="large">
                    LEAVE POD
                </Button>
            )}
        </Layout>
    )
}

export default PodLeaveModal
