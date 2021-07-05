import React, { useState, useEffect } from 'react'
import { StyleSheet, Image, View, Keyboard } from 'react-native'
import { Text, Button, Input, Card, Spinner } from '@ui-kitten/components'
import { Icon, WhiteSpace } from '@ant-design/react-native'
import moment from 'moment'
import { useMutation } from '@apollo/react-hooks'
import { useSelector, useDispatch } from 'react-redux'
import {
    SET_DROP_STORAGE_ARRAY,
    SET_DROP_FUNCTIONALITY,
    ADD_LOADING_ENGAGEMENT_DROP,
    REMOVE_LOADING_ENGAGEMENT_DROP,
} from '../../../redux/actions.redux'
import { ENGAGE_DROP } from './engageDrop.gql'
import { COLORS, FONTS } from '../../../styles'
import { MARKED_COMPLETE, DECLINE } from '../../../common/constants'
import { MutationEngageDropArgs } from '../../../generated-types'
import { setDropsToStorage, isInteractionType } from '../async-storage.utility'
import { IImageCompatibilityPlug, IDropStorageItem } from '../../../types.any'
import { IReduxState } from '../../../redux/state.redux'

const Styles = StyleSheet.create({
    safearea: {
        flex: 1,
        padding: 10,
        width: 360,
        borderWidth: 0,
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
    headerImage: {
        flex: 1,
        height: 150,
        maxHeight: 200,
    },
    viewPost: {
        marginTop: 50,
        marginBottom: 10,
    },
    card: {
        borderRadius: 10,
        justifyContent: 'center',
        alignContent: 'flex-start',
        textAlignVertical: 'center',
        width: 360,
    },
    buttonMenu: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    loadingLayout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 50,
    },
    rowContainer: {
        flexDirection: 'row',
    },
    hyperlink: {
        color: COLORS.FONT.HYPERLINK,
    },
    completeMessage: {
        flex: 1,
    },
    modalText: {
        fontFamily: FONTS.FORMAL,
        color: COLORS.BLACK['500'],
        fontSize: 16,
    },
})

const DropQuickPreview = () => {
    const [comment, setComment] = useState('')
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const { username: engagerUsername, id: engagerId } = useSelector(
        (state: IReduxState) => state.userParams
    )
    const loadingEngagementDrop = useSelector(
        (state: IReduxState) => state.loadingEngagementDrop
    )
    const storageDropArray = useSelector(
        (state: IReduxState) => state.storageDropArray
    )

    const { drop, type } = useSelector(
        (state: IReduxState) => state.dropFunctionality
    )

    const [
        engageDrop,
        { loading: engageDropLoading, error: engageDropError },
    ] = useMutation(ENGAGE_DROP)

    useEffect(() => {
        setErrorMessage(
            (engageDropError?.message || '')?.replace('GraphQL error: ', '')
        )
    }, [engageDropError])

    if (drop === null) {
        return null
    }

    const isLoading =
        engageDropLoading ||
        loading ||
        loadingEngagementDrop.indexOf(drop.id) > -1
    // determines if the drop is completed already
    const isCompleted = isInteractionType(
        drop.id,
        [MARKED_COMPLETE],
        storageDropArray
    )
    // determines if drop is already declined
    const isDeclined = isInteractionType(drop.id, [DECLINE], storageDropArray)

    const closeModal = () =>
        dispatch({
            type: SET_DROP_FUNCTIONALITY,
            payload: { visible: false, drop, type },
        })
    const isFinished = isDeclined || isCompleted

    if (errorMessage) {
        return (
            <View style={Styles.errorview}>
                <Text category="h2" style={Styles.errortitle}>
                    Ouch 🤕
                </Text>
                <Text
                    style={Styles.errormessage}
                >{`${errorMessage}.  Click below to go back.`}</Text>
                <Button
                    status="warning"
                    onPress={() => {
                        setErrorMessage('')
                        closeModal()
                    }}
                >
                    Back
                </Button>
            </View>
        )
    }
    /**
     * engages with a drop by 1) adding the drop to local storage (for ux) and 2) adding an 'engagement' in the backend
     * @param interactionType string: the type of engagmenet (i.e. marked_complete, decline etc)
     * @param closeModalAfterwards boolean close the modal
     *
     * @note this code gets somewhat hard codedly copied in ../../pod/pod-view.component
     */
    const engageWithDrop = async (
        interactionType: string,
        closeModalAfterwards = true
    ) => {
        setLoading(true)
        dispatch({ type: ADD_LOADING_ENGAGEMENT_DROP, payload: drop.id })
        const mutationArgs: MutationEngageDropArgs = {
            dropId: drop.id,
            dropperId: drop.userId,
            engagerUsername,
            interactionType,
            contents: comment,
        }

        await engageDrop({
            variables: mutationArgs,
            // refetchQueries: ['getMyProfile'],
        })
        if ([MARKED_COMPLETE, DECLINE].indexOf(interactionType) > -1) {
            // set to local host that this has been marked as complete
            // this will gey out the drop in the list and not show it in the list
            addDropToLocalStorage(drop.id, interactionType)
        }
        dispatch({ type: REMOVE_LOADING_ENGAGEMENT_DROP, payload: drop.id })
        setLoading(false)
        if (closeModalAfterwards) {
            setShowSuccessMessage(true)
            setTimeout(() => {
                closeModal()
            }, 1000)
        }
    }

    const customCardHeader = (img: IImageCompatibilityPlug) => {
        return <Image style={Styles.headerImage} source={img} />
    }

    /**
     * this adds a drop to local storage array - to be checked out as white in list pod view
     * @param dropId the id of the drop to add
     */
    const addDropToLocalStorage = async (
        dropId: string,
        interactionType: string
    ) => {
        const newDropItem: IDropStorageItem = {
            dropId,
            dateCreated: moment().valueOf(),
            interactionType,
        }
        // now add the new drop:
        storageDropArray.unshift(newDropItem)
        // add the item to redux:

        dispatch({ type: SET_DROP_STORAGE_ARRAY, payload: storageDropArray })
        // update the local storage:
        return setDropsToStorage(storageDropArray, engagerId)
    }

    const renderFooter = () => {
        if (isCompleted || isDeclined) {
            return (
                <View>
                    {isCompleted ? (
                        <View>
                            <View style={Styles.rowContainer}>
                                <Icon name="check-circle" color="green" />
                                <Text
                                    style={Styles.completeMessage}
                                    numberOfLines={1}
                                >{`  You have completed this drop`}</Text>
                            </View>
                        </View>
                    ) : null}
                    {isDeclined ? (
                        <View>
                            <View style={Styles.rowContainer}>
                                <Icon name="close-circle" color="red" />
                                <Text
                                    style={Styles.completeMessage}
                                    numberOfLines={1}
                                >
                                    {`  You have declined to engage with this drop`}
                                </Text>
                            </View>
                        </View>
                    ) : null}
                </View>
            )
        }
        return (
            <View style={Styles.buttonMenu}>
                <Button
                    onPress={() => closeModal()}
                    status="basic"
                    appearance="ghost"
                >
                    CANCEL
                </Button>
                {!isLoading ? (
                    <Button
                        onPress={() =>
                            engageWithDrop(
                                type === DECLINE ? DECLINE : MARKED_COMPLETE
                            )
                        }
                        appearance="ghost"
                        disabled={isFinished}
                    >
                        SUBMIT
                    </Button>
                ) : (
                    <Spinner />
                )}
            </View>
        )
    }

    return (
        <Card
            status="success"
            style={Styles.card}
            header={() => customCardHeader(drop.image)}
            footer={renderFooter}
        >
            <View>
                {type === MARKED_COMPLETE ? (
                    <View>
                        <WhiteSpace />
                        <Text style={Styles.modalText}>
                            Mark this drop as completed?
                        </Text>
                        <WhiteSpace />
                        <Text style={Styles.modalText}>
                            Remember to comment on the post to gain karma 🎉
                        </Text>
                        {loadingEngagementDrop.indexOf(drop.id) > -1 ? (
                            <>
                                <WhiteSpace size="lg" />
                                <WhiteSpace />
                                <Text style={Styles.modalText}>
                                    ℹ️ Verifying your comment...
                                </Text>
                            </>
                        ) : null}
                    </View>
                ) : null}

                {type === DECLINE ? (
                    <Input
                        value={comment}
                        placeholder="Leave an optional note..."
                        onChangeText={v => setComment(v)}
                        label="Why declining? (optional)"
                        onSubmitEditing={() => Keyboard.dismiss()}
                        multiline={true}
                        maxLength={100}
                        size="large"
                    />
                ) : null}
            </View>
        </Card>
    )
}

export default DropQuickPreview
