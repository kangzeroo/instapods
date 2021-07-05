import React, { useState, useEffect } from 'react'
import {
    StyleSheet,
    ScrollView,
    View,
    BackHandler,
    Linking,
    TouchableOpacity,
    RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-navigation'
import {
    Text,
    Card,
    Button,
    Layout,
    Modal,
    Spinner,
    CheckBox,
} from '@ui-kitten/components'
import { Icon, TextareaItem } from '@ant-design/react-native'
import auth from '@react-native-firebase/auth'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { useSelector, useDispatch } from 'react-redux'
import { GET_POD_AS_MEMBER } from '../pod-view/pod-view.gql'
import { profileAvatar } from '../pod-view/pod-view.utility'
import {
    LEAVE_POD,
    KICK_POD_MEMBERS,
    PROMOTE_POD_MEMBERS,
    DEMOTE_POD_MEMBERS,
    UPDATE_POD_PRIVATE_DESCRIPTION,
} from './manage-pod.gql'
import { COLORS, FONTS } from '../../../styles'
import PodInviteModal from './modals/pod-invite-modal.component'
import PodLeaveModal from './modals/pod-leave-modal.component'
import PodKickModal from './modals/pod-kick-modal.component'
import PodPromoteAdminModal from './modals/pod-promote-admin-modal.component'
import PodDemoteAdminModal from './modals/pod-demote-admin-modal.component'
import {
    PodAsMember,
    PublicUser,
    QueryGetPodDetailsAsMemberArgs,
    MutationLeavePodArgs,
    MutationKickPodMembersArgs,
    MutationPromotePodMembersArgs,
    MutationDemotePodMembersArgs,
    MutationUpdatePodPrivateDescriptionArgs,
} from '../../../generated-types'
import { IReactNavigationPlug } from '../../../types.any'
import { ROUTES, INSTAGAM_URL } from '../../../common/constants'
import { IReduxState } from '../../../redux/state.redux'
import { TOGGLE_BOTTOM_BAR_VISIBLE } from '../../../redux/actions.redux'
import { Header } from '../../../common/components/header.component'
import { KarmaTag } from '../../../common/components/karma-tag.component'

const iconMargin = 10

type Props = { navigation: IReactNavigationPlug }
const ManagePodScreen = ({ navigation }: Props) => {
    const podId = useSelector((state: IReduxState) => state.currentPod)
    const [reduxError, setReduxError] = useState(null)
    const [showInviteModal, setShowInviteModal] = useState(false)
    const [showLeaveModal, setShowLeaveModal] = useState(false)
    const [showKickModal, setShowKickModal] = useState(false)
    const [showPromoteAdminModal, setShowPromoteAdminModal] = useState(false)
    const [showDemoteAdminModal, setShowDemoteAdminModal] = useState(false)
    const [isEditModeOn, setIsEditModeOn] = useState(false)
    const [descriptionVisible, setDescriptionVisible] = useState(false)
    const [editPrivateDescription, setEditPrivateDescription] = useState('')
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isDescriptionEditable, setIsDescriptionEditable] = useState(false)
    const dispatch = useDispatch()

    // here is function to leave pod
    const [
        leavePod,
        { loading: leaveLoading, error: leaveError },
    ] = useMutation(LEAVE_POD)

    // here is function to kick mawfakas
    const [
        kickPodMembers,
        { loading: kickLoading, error: kickError },
    ] = useMutation(KICK_POD_MEMBERS)

    // here is the function to PROMOTE pod members
    const [
        promotePodMembers,
        { loading: promoteLoading, error: promoteError },
    ] = useMutation(PROMOTE_POD_MEMBERS)

    // function to demote members:
    const [
        demotePodMembers,
        { loading: demoteLoading, error: demoteError },
    ] = useMutation(DEMOTE_POD_MEMBERS)

    const [
        updatePodPrivateDescription,
        {
            loading: updatePrivateDescriptionLoading,
            error: updatePrivateDescriptionError,
        },
    ] = useMutation(UPDATE_POD_PRIVATE_DESCRIPTION)
    const [selectedMembers, setSelectedMembers] = useState<Array<string>>([])
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => {
            setIsEditModeOn(false)
            setSelectedMembers([])
        })
    })
    useEffect(() => {
        // set editable description to not editable
        if (!descriptionVisible && isDescriptionEditable) {
            setIsDescriptionEditable(false)
        }
    }, [descriptionVisible, isDescriptionEditable])

    const queryArgs: QueryGetPodDetailsAsMemberArgs = {
        podId,
    }
    const { loading, error, data, refetch } = useQuery(GET_POD_AS_MEMBER, {
        variables: queryArgs,
    })

    useEffect(() => {
        const setError: any =
            error ||
            leaveError ||
            kickError ||
            promoteError ||
            demoteError ||
            updatePrivateDescriptionError
        if (setError) {
            setReduxError(setError)
            setDescriptionVisible(false)
        }
    }, [
        error,
        leaveError,
        kickError,
        promoteError,
        demoteError,
        updatePrivateDescriptionError,
        setReduxError,
    ])

    const backButtonCallback = () => {
        navigation.goBack()
        setReduxError(null)
        setTimeout(() => {
            dispatch({
                type: TOGGLE_BOTTOM_BAR_VISIBLE,
                payload: true,
            })
        }, 100)
    }
    if (loading) {
        return (
            <Layout style={Styles.loadingLayout}>
                <Spinner size="giant" />
            </Layout>
        )
    }

    if (reduxError) {
        const errorMessage = reduxError?.message?.replace('GraphQL error: ', '')
        return (
            <View style={Styles.errorview}>
                <Text category="h2" style={Styles.errortitle}>
                    Ouch 🤕
                </Text>
                <Text
                    style={Styles.errormessage}
                >{`${errorMessage}.  Click below to go back.`}</Text>
                <Button status="warning" onPress={backButtonCallback}>
                    Back
                </Button>
            </View>
        )
    }

    const pod: PodAsMember = data.getPodDetailsAsMember
    const { name, admins, members, privateDescription } = pod

    const addOrRemoveFromSelectedMembers = (editUserId: string) => {
        if (selectedMembers.includes(editUserId)) {
            setSelectedMembers(
                selectedMembers.filter(uid => uid !== editUserId)
            )
        } else {
            setSelectedMembers(selectedMembers.concat([editUserId]))
        }
    }
    const adminIds = admins.map((a: PublicUser) => a.id)
    const myId = auth().currentUser?.uid || ''
    const isAdmin = adminIds.indexOf(myId) > -1
    // re-order members so admins are first
    members.sort((a: PublicUser, b: PublicUser) => {
        const aAdmin = adminIds.includes(a.id)
        const bAdmin = adminIds.includes(b.id)
        if (aAdmin && bAdmin) {
            return 0
        }
        if (aAdmin) {
            return -1
        }
        if (bAdmin) {
            return 1
        }
        return 0
    })

    const isEditableMember = (memberId: string) =>
        isEditModeOn && memberId !== myId
    const hasOnlyAdminsSelected = () => {
        let isSelectAdmin = true
        if (selectedMembers.length === 0) {
            return false
        }
        selectedMembers.forEach((id: string) => {
            if (!adminIds.includes(id)) {
                isSelectAdmin = false
            }
        })
        return isSelectAdmin
    }

    const hasAnySelected = () => {
        return selectedMembers.length > 0
    }

    const hasOnlyNonAdminsSelected = () => {
        let notAdmin = true
        if (selectedMembers.length === 0) {
            return false
        }
        selectedMembers.forEach((id: string) => {
            if (adminIds.includes(id)) {
                notAdmin = false
            }
        })
        return notAdmin
    }

    const onBackCallback = () => {
        navigation.goBack()
        setIsEditModeOn(false)
        setSelectedMembers([])
    }

    /**
     * removes the signed in user from the current pod
     */
    const leavePodFn = async () => {
        const leavePodArgs: MutationLeavePodArgs = {
            podId,
        }

        await leavePod({
            variables: leavePodArgs,
            refetchQueries: ['listMyPods'],
        }).then(() => {
            // close modeal
            setShowLeaveModal(false)
            navigation.navigate(ROUTES.PODSLIST_SCREEN)
        })
    }

    /**
     * recursively goes through list of offenders, removing each one
     * @param listOfOffenders list of offenders (to remove from pod)
     * @type array<TUserId>
     */
    const kickUsers = async (listOfOffenders: Array<string>) => {
        if (listOfOffenders.length > 0) {
            const kickOutArgs: MutationKickPodMembersArgs = {
                podId,
                offenderIds: listOfOffenders,
            }
            await kickPodMembers({
                variables: kickOutArgs,
                refetchQueries: ['getPodDetailsAsMember', 'listMyPods'],
            })
        }
        // close the modal:
        setShowKickModal(false)
        setIsEditModeOn(false)
    }

    /**
     * recursively runs through listofUsers promoting each one indidivdually
     * @param listofUsers Array<TUserId> a list of users to promote
     */
    const promoteUsers = async (listofUsers: Array<string>) => {
        if (listofUsers.length > 0) {
            const promoteUsersArgs: MutationPromotePodMembersArgs = {
                podId,
                userIds: listofUsers,
            }
            await promotePodMembers({
                variables: promoteUsersArgs,
                refetchQueries: ['getPodDetailsAsMember'],
            }).then(() => {
                setSelectedMembers([])
            })
        }
        // close the modal:
        setShowPromoteAdminModal(false)
        setIsEditModeOn(false)
    }

    const PrivateDescription = () => (
        <View style={Styles.descriptionContainer}>
            <Text>{privateDescription || 'There is no description'}</Text>
        </View>
    )

    const updatePrivateDescription = async () => {
        if (!editPrivateDescription) {
            return
        }
        const params: MutationUpdatePodPrivateDescriptionArgs = {
            podId,
            privateDescription: editPrivateDescription,
        }
        await updatePodPrivateDescription({
            variables: params,
            refetchQueries: ['getPodDetailsAsMember'],
            awaitRefetchQueries: true,
        }).then(() => {
            setIsDescriptionEditable(false)
        })
    }

    const onRefresh = () => {
        setIsRefreshing(true)
        refetch()
            .then(() => {
                setIsRefreshing(false)
            })
            .catch(() => {
                setIsRefreshing(false)
            })
    }

    const returnEditablePrivateDescription = () => {
        if (isAdmin) {
            // edit with textarea
            if (isDescriptionEditable || !privateDescription) {
                return (
                    <View style={Styles.descriptionContainer}>
                        <TextareaItem
                            // rows={4}
                            autoHeight
                            placeholder="Description and guidelines of your pod"
                            defaultValue={privateDescription || ''}
                            value={editPrivateDescription || privateDescription}
                            onChange={e => setEditPrivateDescription(e || '')}
                        />
                        {updatePrivateDescriptionLoading ? (
                            <Layout style={Styles.loadingPrivateDescription}>
                                <Spinner size="giant" />
                            </Layout>
                        ) : (
                            <Button
                                appearance="ghost"
                                status="basic"
                                onPress={updatePrivateDescription}
                            >
                                Submit
                            </Button>
                        )}
                    </View>
                )
            }
            // show the public description but turn on edit on click
            return (
                <TouchableOpacity
                    onPress={() => setIsDescriptionEditable(true)}
                >
                    <PrivateDescription />
                </TouchableOpacity>
            )
        }
        // just an average joe finna look at the description
        return <PrivateDescription />
    }

    const demoteUsers = async (listofUsers: Array<string>) => {
        if (listofUsers.length > 0) {
            const demoteUsersArgs: MutationDemotePodMembersArgs = {
                podId,
                userIds: listofUsers,
            }
            await demotePodMembers({
                variables: demoteUsersArgs,
                refetchQueries: ['getPodDetailsAsMember'],
            }).then(() => {
                setSelectedMembers([])
            })
        }
        // close the modal:
        setShowDemoteAdminModal(false)
    }

    return (
        <SafeAreaView style={Styles.safearea}>
            <Header
                title={`${members.length} Members`}
                onBack={onBackCallback}
                action={{
                    icon: 'log-out-outline',
                    onPress: () => setShowLeaveModal(true),
                }}
            />
            <View style={Styles.logoWrap}>
                <View style={Styles.rowContainer}>
                    <Text style={Styles.logo}>{name}</Text>
                    {privateDescription || isAdmin ? (
                        <TouchableOpacity
                            style={Styles.iconContainer}
                            onPress={() =>
                                setDescriptionVisible(!descriptionVisible)
                            }
                        >
                            {descriptionVisible ? (
                                <Icon name="close" color="#8F9BB3" />
                            ) : (
                                <Icon name="info-circle" color="#8F9BB3" />
                            )}
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
            {descriptionVisible && (
                <View>{returnEditablePrivateDescription()}</View>
            )}
            <View style={Styles.podActions}>
                {isEditModeOn ? (
                    <>
                        <View style={Styles.buttonWrapper}>
                            <Button
                                appearance="ghost"
                                status="basic"
                                onPress={() => {
                                    setIsEditModeOn(false)
                                    setSelectedMembers([])
                                }}
                                textStyle={Styles.buttonText}
                            >
                                Cancel
                            </Button>
                        </View>

                        {hasOnlyAdminsSelected() ? (
                            <View style={Styles.buttonWrapper}>
                                <Button
                                    appearance="ghost"
                                    status="basic"
                                    onPress={() =>
                                        setShowDemoteAdminModal(true)
                                    }
                                    textStyle={Styles.buttonText}
                                >
                                    Demote Admin
                                </Button>
                            </View>
                        ) : null}
                        {hasOnlyNonAdminsSelected() ? (
                            <View style={Styles.buttonWrapper}>
                                <Button
                                    appearance="ghost"
                                    status="basic"
                                    onPress={() =>
                                        setShowPromoteAdminModal(true)
                                    }
                                    textStyle={Styles.buttonText}
                                >
                                    Promote Admin
                                </Button>
                            </View>
                        ) : null}
                        {hasAnySelected() ? (
                            <View style={Styles.buttonWrapper}>
                                <Button
                                    appearance="ghost"
                                    status="basic"
                                    onPress={() => setShowKickModal(true)}
                                    textStyle={Styles.buttonText}
                                >
                                    Kick from Pod
                                </Button>
                            </View>
                        ) : null}
                    </>
                ) : (
                    <>
                        <Button
                            appearance="ghost"
                            status="basic"
                            onPress={() => setShowInviteModal(true)}
                        >
                            Invite Members
                        </Button>
                        {adminIds.includes(myId) ? (
                            <Button
                                appearance="ghost"
                                status="basic"
                                onPress={() => setIsEditModeOn(true)}
                            >
                                Manage Pod
                            </Button>
                        ) : (
                            <Button
                                appearance="ghost"
                                status="basic"
                                onPress={() => setShowLeaveModal(true)}
                            >
                                Leave Pod
                            </Button>
                        )}
                    </>
                )}
            </View>
            <ScrollView
                style={Styles.layout}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {members.map((member: PublicUser) => {
                    return (
                        <View key={member.id} style={Styles.cardWrapper}>
                            <Card
                                style={Styles.card}
                                onPress={() => {
                                    if (!isEditModeOn) {
                                        Linking.openURL(
                                            `${INSTAGAM_URL}${member.username}`
                                        )
                                    } else if (isEditableMember(member.id)) {
                                        addOrRemoveFromSelectedMembers(
                                            member.id
                                        )
                                    }
                                }}
                            >
                                <View style={Styles.header}>
                                    <View style={Styles.memberName}>
                                        {isEditModeOn ? (
                                            <CheckBox
                                                checked={selectedMembers.includes(
                                                    member.id
                                                )}
                                                onChange={() =>
                                                    addOrRemoveFromSelectedMembers(
                                                        member.id
                                                    )
                                                }
                                                disabled={
                                                    !isEditableMember(member.id)
                                                }
                                                style={Styles.checkBox}
                                            />
                                        ) : null}
                                        {profileAvatar(member.image)}
                                        <View
                                            style={Styles.memberNameContainer}
                                        >
                                            <Text
                                                style={Styles.headerText}
                                                category="h6"
                                                numberOfLines={1}
                                            >
                                                {member.username}
                                            </Text>
                                            {adminIds.includes(member.id) ? (
                                                <Text style={Styles.adminBadge}>
                                                    Admin
                                                </Text>
                                            ) : null}
                                        </View>
                                    </View>
                                    <View style={Styles.karmaContainer}>
                                        {KarmaTag(member.karma)}
                                    </View>
                                </View>
                            </Card>
                        </View>
                    )
                })}
            </ScrollView>
            <Modal
                backdropStyle={Styles.backdrop}
                onBackdropPress={() => setShowInviteModal(false)}
                visible={showInviteModal}
            >
                <PodInviteModal
                    closeModal={() => setShowInviteModal(false)}
                    pod={data.getPodDetailsAsMember}
                />
            </Modal>
            <Modal
                backdropStyle={Styles.backdrop}
                onBackdropPress={() => setShowLeaveModal(false)}
                visible={showLeaveModal}
            >
                <PodLeaveModal
                    closeModal={() => setShowLeaveModal(false)}
                    leavePod={leavePodFn}
                    loading={leaveLoading}
                    pod={pod}
                />
            </Modal>
            <Modal
                backdropStyle={Styles.backdrop}
                onBackdropPress={() => setShowKickModal(false)}
                visible={showKickModal}
            >
                <PodKickModal
                    users={members.filter(m => {
                        if (selectedMembers.includes(m.id)) {
                            return true
                        }
                        return false
                    })}
                    pod={pod}
                    onPressSubmit={kickUsers}
                    loading={kickLoading}
                />
            </Modal>
            <Modal
                backdropStyle={Styles.backdrop}
                onBackdropPress={() => setShowPromoteAdminModal(false)}
                visible={showPromoteAdminModal}
            >
                <PodPromoteAdminModal
                    users={members.filter(m => {
                        if (selectedMembers.includes(m.id)) {
                            return true
                        }
                        return false
                    })}
                    pod={pod}
                    onPressSubmit={promoteUsers}
                    loading={promoteLoading}
                />
            </Modal>
            <Modal
                backdropStyle={Styles.backdrop}
                onBackdropPress={() => setShowDemoteAdminModal(false)}
                visible={showDemoteAdminModal}
            >
                <PodDemoteAdminModal
                    users={members.filter(m => {
                        if (selectedMembers.includes(m.id)) {
                            return true
                        }
                        return false
                    })}
                    pod={pod}
                    loading={demoteLoading}
                    onPressSubmit={demoteUsers}
                />
            </Modal>
        </SafeAreaView>
    )
}

const Styles = StyleSheet.create({
    safearea: {
        flex: 1,
        backgroundColor: COLORS.WHITE['100'],
    },
    layout: {
        flex: 1,
        padding: 10,
        backgroundColor: COLORS.WHITE['100'],
    },
    cardWrapper: {
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginBottom: 5,
    },
    card: {
        marginBottom: 10,
        borderRadius: 10,
    },
    headerImage: {
        flex: 1,
        height: 150,
        maxHeight: 200,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    headerText: {
        fontFamily: FONTS.FORMAL,
        // textTransform: 'uppercase',
        fontSize: 16,
        color: COLORS.BLACK['500'],
        justifyContent: 'center',
        textAlignVertical: 'center',
        alignSelf: 'center',
        paddingTop: 8,
        overflow: 'hidden',
        marginLeft: 8,
        flex: -1,
    },
    badgeWrap: {
        backgroundColor: COLORS.GREEN['600'],
        borderRadius: 20,
        paddingHorizontal: 7,
        paddingVertical: 0,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'flex-start',
        textAlignVertical: 'center',
        marginRight: 10,
        // width: 120,
    },
    memberNameContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    badge: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 12,
    },

    logoWrap: {
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 20,
        height: 80,
        marginLeft: iconMargin,
    },
    podActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        width: '100%',
    },
    logo: {
        fontSize: 32,
        lineHeight: 45,
        fontFamily: FONTS.LOGO_FONT,
        textAlign: 'center',
    },
    loadingLayout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        backgroundColor: COLORS.SHADE['100'],
    },
    memberName: {
        flexDirection: 'row',
        flex: 1,
    },
    checkBox: {
        marginRight: 20,
    },
    adminBadge: {
        color: COLORS.RED['500'],
        fontSize: 12,
        textAlignVertical: 'center',
        marginLeft: 8,
    },
    karmaContainer: {
        marginTop: 6,
        marginLeft: 8,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    iconContainer: {
        margin: iconMargin,
    },
    descriptionContainer: {
        marginHorizontal: 30,
        marginBottom: 15,
        // justifyContent: 'center',
        // alignItems: 'center',
        // textAlign: 'center',
    },
    errorview: {
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        alignContent: 'center',
        textAlign: 'center',
    },
    errortitle: {
        textAlign: 'left',
    },
    errormessage: {
        fontSize: 20,
        lineHeight: 25,
        textAlign: 'left',
        marginVertical: 20,
    },
    loadingPrivateDescription: {
        width: '100%',
        margin: 10,
        alignItems: 'center',
    },
    buttonWrapper: {
        flex: 1,
        flexGrow: 1,
        paddingHorizontal: 10,
        maxWidth: 200,
    },
    buttonText: {
        marginHorizontal: -10,
        textAlign: 'left',
    },
})

export default ManagePodScreen
