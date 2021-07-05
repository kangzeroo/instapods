import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { StyleSheet, View } from 'react-native'
import { Text, Layout, Button, Divider } from '@ui-kitten/components'
import { List, Picker, WhiteSpace } from '@ant-design/react-native'
import { TOGGLE_BOTTOM_BAR_VISIBLE } from '../../../redux/actions.redux'
import { PodAsMember } from '../../../generated-types'
import { IReactNavigationPlug } from '../../../types.any'
import { ROUTES } from '../../../common/constants'
import { FONTS, COLORS } from '../../../common/styles'
import PodInviteModal from '../manage-pod/modals/pod-invite-modal.component'
import NoPodsSplash from './no-pods-splash.component'

const Styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 30,
        width: 300,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: COLORS.BLACK['400'],
    },
    headline: {
        fontFamily: FONTS.FORMAL,
        color: COLORS.BLACK['500'],
        fontWeight: '600',
        fontSize: 19,
        marginTop: 5,
    },
    paragraph: {
        // paddingHorizontal: 50,
        fontFamily: FONTS.FORMAL,
        marginTop: 5,
        // fontSize: 20,
        // fontWeight: '500',
        color: COLORS.BLACK['500'],
        lineHeight: 25,
    },
})

type Props = {
    pods: Array<PodAsMember> // | PodPreview>
    closeModal: () => void
    navigation: IReactNavigationPlug
}
const InviteFriendsModal = ({ pods, closeModal, navigation }: Props) => {
    const [selectedPod, setSelectedPod] = useState(null)
    const dispatch = useDispatch()
    const createPod = () => {
        closeModal()
        dispatch({
            type: TOGGLE_BOTTOM_BAR_VISIBLE,
            payload: false,
        })
        navigation.navigate(ROUTES.POD_ONBOARDING.NAVIGATION)
    }
    if (selectedPod) {
        return (
            <View>
                <PodInviteModal
                    pod={selectedPod}
                    backOption={() => setSelectedPod(null)}
                />
            </View>
        )
    }
    return (
        <Layout style={Styles.root}>
            {pods && pods.length > 0 ? (
                <View>
                    <Text category="h6" style={Styles.paragraph}>
                        Invite friends to pod:
                    </Text>
                    <WhiteSpace size="lg" />
                    <List>
                        {pods.map((pod: PodAsMember) => {
                            return (
                                <View>
                                    <Picker
                                        extra=" "
                                        // value={pod.id}
                                        //   onChange={this.onChange}
                                    >
                                        <List.Item
                                            arrow="horizontal"
                                            extra={null}
                                            onPress={() => {
                                                setSelectedPod(pod)
                                            }}
                                        >
                                            <Text>{pod.slug}</Text>
                                        </List.Item>
                                    </Picker>
                                </View>
                            )
                        })}
                    </List>
                </View>
            ) : (
                <View>
                    <Text style={Styles.headline}>
                        You need to create a pod before you can invite a friend
                        😘
                    </Text>
                    <WhiteSpace size="lg" />
                    <Divider />
                    <NoPodsSplash createPodOnboarding={createPod} />
                </View>
            )}
            {/* <Text>yello</Text> */}
            <WhiteSpace size="lg" />
            <Button onPress={closeModal} appearance="ghost" status="basic">
                Close
            </Button>
        </Layout>
    )
}

export default InviteFriendsModal
