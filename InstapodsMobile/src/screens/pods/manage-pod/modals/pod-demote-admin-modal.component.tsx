import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Layout, Text, Icon, Button, Spinner } from '@ui-kitten/components'
import { COLORS, FONTS } from '../../../../styles'
import { PodAsMember, PublicUser } from '../../../../generated-types'

const Styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 30,
        width: 300,
        borderRadius: 15,
    },
    headline: {
        fontFamily: FONTS.FORMAL,
        color: COLORS.BLACK['500'],
        justifyContent: 'center',
        textAlignVertical: 'center',
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        marginBottom: 15,
        flexWrap: 'wrap',
    },
    checkline: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 5,
    },
    checklineText: {
        marginLeft: 10,
        fontSize: 18,
    },
    button: {
        marginTop: 20,
    },
    centeringRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 12,
    },
})

const LoadingSpinner = () => (
    <View style={Styles.centeringRow}>
        <Spinner />
    </View>
)

type Props = {
    users: Array<PublicUser>
    pod: PodAsMember
    loading: boolean
    onPressSubmit: (userIds: Array<string>) => void
}
const PodDemoteAdminModal = ({ users, pod, onPressSubmit, loading }: Props) => {
    return (
        <Layout style={Styles.root}>
            <Text
                style={Styles.headline}
                category="h6"
            >{`Demote these users as admins of @${pod.slug}?`}</Text>
            <View>
                {users.map(user => (
                    <View key={user.id} style={Styles.checkline}>
                        <Icon
                            name="person-remove-outline"
                            width={32}
                            height={32}
                            fill={COLORS.GREEN['500']}
                        />
                        <Text style={Styles.checklineText}>
                            {user.username}
                        </Text>
                    </View>
                ))}
            </View>
            {loading ? (
                LoadingSpinner()
            ) : (
                <Button
                    onPress={() => {
                        onPressSubmit(users.map(d => d.id))
                    }}
                    status="danger"
                    style={Styles.button}
                >
                    DEMOTE ADMINS
                </Button>
            )}
        </Layout>
    )
}

export default PodDemoteAdminModal
