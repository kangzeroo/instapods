import React, { useState, useEffect } from 'react'
import {
    StyleSheet,
    ScrollView,
    BackHandler,
    Keyboard,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { WhiteSpace, Checkbox } from '@ant-design/react-native'
import {
    Text,
    Layout,
    Input,
    Spinner,
    Button,
    Divider,
} from '@ui-kitten/components'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { useDispatch } from 'react-redux'
// import DismissKeyboardHOC from '../../../common/components/keyboard-dismiss-hoc.component'
import { ROUTES } from '../../../common/constants'
import {
    // TOGGLE_BOTTOM_BAR_VISIBLE,
    TOGGLE_UPLOADING_DROP,
    TOGGLE_FORCE_ONBOARDING,
    SET_UPLOADING_DROP_POD_IDS,
    TOGGLE_BOTTOM_BAR_VISIBLE,
} from '../../../redux/actions.redux'
import { GET_POD_LIST } from '../../pods/pods-list/get-pods-list.gql'
import { CREATE_DROP, RELEASE_DROP } from './new-drop.gql'
import { COLORS, FONTS } from '../../../styles'
import {
    PodPreview,
    MutationCreateDropArgs,
    MutationReleaseDropArgs,
} from '../../../generated-types'
import { IReactNavigationPlug } from '../../../types.any'
import { Header } from '../../../common/components/header.component'
import NoPodsSplash from '../../pods/pods-list/no-pods-splash.component'

interface ICheckablePodPreview extends PodPreview {
    checked: boolean
}
type Props = { navigation: IReactNavigationPlug }
const NewDropScreen = ({ navigation }: Props) => {
    const dispatch = useDispatch()
    const [dropTitle, setDropTitle] = useState('')
    const [webLink, setWebLink] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [chosenPods, setChosenPods] = useState<Array<ICheckablePodPreview>>(
        []
    )
    const { loading, error, data } = useQuery(GET_POD_LIST)
    const [
        createDrop,
        { loading: submitDropLoading, error: submitDropError },
    ] = useMutation(CREATE_DROP)
    const [
        releaseDrop,
        { loading: releaseDropLoading, error: releaseDropError },
    ] = useMutation(RELEASE_DROP)
    const listMyPods = data?.listMyPods

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', backButtonCallback)
    })
    useEffect(() => {
        console.log('setting chosen pods')
        setChosenPods(
            listMyPods.map((pod: PodPreview) => ({
                ...pod,
                checked: false,
            }))
        )
    }, [listMyPods])

    useEffect(() => {
        setErrorMessage(
            (
                error?.message ||
                submitDropError?.message ||
                releaseDropError?.message ||
                ''
            )?.replace('GraphQL error: ', '')
        )
    }, [error, submitDropError, releaseDropError])

    const backButtonCallback = () => {
        // navigation.goBack()
        backAndClear()
        // dispatch({
        //     type: TOGGLE_BOTTOM_BAR_VISIBLE,
        //     payload: true,
        // })
        setTimeout(() => {
            setErrorMessage('')
        }, 100)
    }

    const updateChosenPods = (podId: string, checked: boolean): void => {
        setChosenPods(
            chosenPods.map((pod: ICheckablePodPreview) => ({
                ...pod,
                checked: pod.id === podId ? checked : pod.checked,
            }))
        )
    }

    const fixWebLink = (urlStr: string) => {
        // // slightly modify webLink if it does not have "https://www." in front:::
        // if (urlStr.slice(0, 5).indexOf('https') === -1) {
        //     // just in case, slice off '://' ->
        //     const urlParts = urlStr.split('://')
        //     const strippedUrl = urlParts[urlParts.length - 1]
        //     if (strippedUrl.slice(0, 4).indexOf('www.') === -1) {
        //         return `https://www.${strippedUrl}`
        //     }
        //     return `https://${strippedUrl}`
        // }
        const idxInstagram = urlStr.indexOf('instagram.com')
        if (idxInstagram > -1) {
            return `https://www.${urlStr.slice(idxInstagram)}` // backend requires www and https....
        }
        return urlStr
        // return urlStr
    }

    const isReadyToDropPost = () => {
        const ready =
            dropTitle.length > 1 &&
            // hashtags.length > 0 &&
            webLink.indexOf('instagram') > -1 &&
            chosenPods &&
            chosenPods.filter(f => f.checked).length > 0
        return ready
    }

    const cancelError = () => {
        setErrorMessage('')
    }

    const clearData = () => {
        setDropTitle('')
        setWebLink('')
        setChosenPods(
            listMyPods.map((pod: PodPreview) => ({
                ...pod,
                checked: false,
            }))
        )
    }

    const backAndClear = () => {
        clearData()
        navigation.goBack()
    }

    const createNewDrop = async () => {
        const podIds = chosenPods.filter(f => f.checked).map(p => p.id)
        try {
            // purely ux standpoint, toggle uploading drop to get a spinner on profile while the drop uploads / scrapes
            dispatch({
                type: TOGGLE_UPLOADING_DROP,
                payload: { loading: true },
            })
            dispatch({
                type: SET_UPLOADING_DROP_POD_IDS,
                payload: podIds,
            })

            setTimeout(() => {
                navigation.goBack()
            }, 2000)

            const mutationArgsCreateDrop: MutationCreateDropArgs = {
                contentUrl: fixWebLink(webLink),
                title: dropTitle,
                desc: '',
                podIds,
            }
            const {
                data: { createDrop: dropId },
            } = await createDrop({
                variables: mutationArgsCreateDrop,
                refetchQueries: [],
            })

            const mutationArgsReleaseDrop: MutationReleaseDropArgs = {
                dropId,
            }

            await releaseDrop({
                variables: mutationArgsReleaseDrop,
                refetchQueries: [
                    'listMyPods',
                    'getMyProfile',
                    'getPodDetailsAsMember',
                ],
                awaitRefetchQueries: true,
            })

            // backAndClear()
            clearData()
            dispatch({
                type: TOGGLE_UPLOADING_DROP,
                payload: { loading: false, success: true },
            })
        } catch (e) {
            setErrorMessage(e.message)
            dispatch({
                type: TOGGLE_UPLOADING_DROP,
                payload: {
                    loading: false,
                    error: true,
                },
            })
        } finally {
            setTimeout(() => {
                dispatch({
                    type: TOGGLE_UPLOADING_DROP,
                    payload: {
                        loading: false,
                        error: false,
                        success: false,
                    },
                })
            }, 6000)
        }
    }

    if (loading) {
        return (
            <Layout style={Styles.loadingLayout}>
                <Spinner size="giant" />
            </Layout>
        )
    }

    if (errorMessage) {
        return (
            <SafeAreaView style={Styles.safearea}>
                <View style={Styles.errorview}>
                    <Text category="h2" style={Styles.errortitle}>
                        Ouch 🤕
                    </Text>
                    <Text
                        style={Styles.errormessage}
                    >{`${errorMessage}.  Click below to go back.`}</Text>
                    <Button status="warning" onPress={cancelError}>
                        Back
                    </Button>
                </View>
            </SafeAreaView>
        )
    }

    const createPod = () => {
        dispatch({
            type: TOGGLE_BOTTOM_BAR_VISIBLE,
            payload: false,
        })
        navigation.navigate(ROUTES.POD_ONBOARDING.NAVIGATION)
    }

    const NewDropHeader = () => (
        <Header
            title="New Drop"
            onBack={backButtonCallback}
            action={{
                icon: 'question-mark-circle-outline',
                onPress: () => {
                    dispatch({
                        type: TOGGLE_FORCE_ONBOARDING,
                        payload: true,
                    })
                    navigation.navigate(ROUTES.DROP_ONBOARDING.NAVIGATION, {
                        screen: ROUTES.DROP_ONBOARDING.SHARE_POST,
                    })
                },
            }}
        />
    )

    if (!chosenPods || chosenPods.length === 0) {
        return (
            <SafeAreaView style={Styles.safearea}>
                <NewDropHeader />
                <View style={Styles.centerLayout}>
                    <Text category="h6" style={Styles.paragraph}>
                        You need to create or join a pod before you can drop a
                        post 😘
                    </Text>
                    <WhiteSpace size="lg" />
                    <WhiteSpace size="lg" />
                    <Divider />
                    <Layout style={Styles.layout}>
                        <NoPodsSplash createPodOnboarding={createPod} />
                    </Layout>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={Styles.safearea}>
            <NewDropHeader />
            <WhiteSpace size="lg" />
            <Layout style={Styles.layout}>
                <ScrollView
                    style={Styles.scrollview}
                    contentContainerStyle={Styles.layout}
                >
                    <Text category="h6">Step 1</Text>
                    <Text category="h5">Paste Link</Text>
                    <WhiteSpace />
                    <WhiteSpace />
                    <WhiteSpace />
                    <Input
                        value={webLink}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Paste Instagram URL"
                        onChangeText={setWebLink}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        maxLength={9999}
                        size="large"
                        style={Styles.input}
                    />
                    <WhiteSpace />
                    <WhiteSpace />
                    <WhiteSpace />
                    <WhiteSpace />
                    <WhiteSpace />
                    <Text category="h6">Step 2</Text>
                    <Text category="h5">Say Thank You</Text>
                    <WhiteSpace />
                    <WhiteSpace />
                    <WhiteSpace />
                    <Input
                        autoCorrect={false}
                        value={dropTitle}
                        placeholder="Thank you message to your Pod Members"
                        onChangeText={setDropTitle}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        maxLength={100}
                        size="large"
                        style={Styles.input}
                    />
                    <WhiteSpace />
                    <WhiteSpace />
                    <WhiteSpace />
                    <WhiteSpace />
                    <WhiteSpace />
                    <View>
                        <Text category="h6">Step 3</Text>
                        <Text category="h5">Select Pods</Text>
                        <WhiteSpace />
                        <WhiteSpace />
                        <WhiteSpace />
                    </View>

                    {chosenPods && chosenPods.length > 0 ? (
                        chosenPods.map(
                            (pod: ICheckablePodPreview, idx: number) => (
                                <>
                                    <View key={pod.id} style={Styles.card}>
                                        <WhiteSpace size="xl" />
                                        <Checkbox
                                            checked={pod.checked}
                                            onChange={() =>
                                                updateChosenPods(
                                                    pod.id,
                                                    !pod.checked
                                                )
                                            }
                                        >
                                            <Text
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                                style={Styles.headerText}
                                            >
                                                {`${pod.name}  `}
                                                {/* {pod.hashtags && pod.hashtags.length > 0 ? (
                                            <Text
                                                style={Styles.postedIn}
                                                numberOfLines={1}
                                            >
                                                {[pod.hashtags]
                                                    .map((d: any) => `#${d}`)
                                                    .join(', ')}
                                            </Text>
                                        ) : (
                                            ''
                                        )} */}
                                            </Text>
                                        </Checkbox>
                                    </View>
                                    {chosenPods &&
                                    idx &&
                                    idx !== chosenPods.length - 1 ? (
                                        <WhiteSpace />
                                    ) : null}
                                </>
                            )
                        )
                    ) : (
                        <View style={Styles.card}>
                            <Text>You are not part of any Pods yet</Text>
                        </View>
                    )}
                </ScrollView>
            </Layout>
            <Layout style={Styles.buttonLayout}>
                {submitDropLoading || releaseDropLoading ? (
                    <View style={Styles.spinnerWrap}>
                        <Spinner size="large" />
                    </View>
                ) : (
                    <Button
                        onPress={createNewDrop}
                        disabled={!isReadyToDropPost()}
                    >
                        DROP POST
                    </Button>
                )}
                <WhiteSpace size="lg" />
            </Layout>
        </SafeAreaView>
    )
}

const Styles = StyleSheet.create({
    safearea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollview: {
        flex: 1,
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
    layout: {
        flexGrow: 1,
        padding: 10,
        justifyContent: 'space-between',
    },
    centerLayout: {
        // flex: 1,
        marginTop: 50,
        flexGrow: 1,
        paddingHorizontal: 50,
        // flexDirection: 'column',
        // justifyContent: 'center',
        // borderWidth: 1,
    },
    podLayout: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    buttonLayout: {
        padding: 20,
        marginBottom: 20,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerText: {
        // height: 35,
        marginLeft: 15,
        color: COLORS.BLACK['500'],
        fontSize: 18,
        flex: 1,
    },
    loadingLayout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        marginBottom: 10,
        textAlign: 'left',
    },
    podListHeader: {
        fontWeight: 'bold',
        marginVertical: 20,
        color: COLORS.BLACK['400'],
    },
    spinnerWrap: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    hashtagStyle: {
        fontFamily: FONTS.FORMAL,
        color: COLORS.BLACK['400'],
    },
    postedIn: {
        fontFamily: FONTS.FORMAL,
        color: COLORS.BLACK['500'],
        fontSize: 14,
    },
    headline: {
        fontFamily: FONTS.FORMAL,
        color: COLORS.BLACK['500'],
        justifyContent: 'center',
        textAlignVertical: 'center',
        alignSelf: 'flex-start',
        flexWrap: 'wrap',
        paddingHorizontal: 50,
    },
    paragraph: {
        fontFamily: FONTS.FORMAL,
        marginTop: 20,
        fontSize: 19,
        fontWeight: '600',
        color: COLORS.BLACK['500'],
        lineHeight: 25,
    },
})

export default NewDropScreen
