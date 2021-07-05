import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View, BackHandler, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import {
    Text,
    Layout,
    Icon,
    Input,
    Button,
    Spinner,
} from '@ui-kitten/components'
import { WhiteSpace } from '@ant-design/react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { useMutation } from '@apollo/react-hooks'
import { useDispatch } from 'react-redux'
// import DismissKeyboardHOC from '../../../common/components/keyboard-dismiss-hoc.component'
import { CREATE_POD } from './create-pod.gql'
import { ROUTES } from '../../../common/constants'
import {
    // TOGGLE_BOTTOM_BAR_VISIBLE,
    TOGGLE_FORCE_ONBOARDING,
    SET_CURRENT_ROUTE,
} from '../../../redux/actions.redux'
import { COLORS } from '../../../styles'
import { MutationCreatePodArgs } from '../../../generated-types'
import { IReactNavigationPlug } from '../../../types.any'
import { Header } from '../../../common/components/header.component'

const AddIcon = (style: object) => <Icon {...style} name="plus-outline" />

type Props = { navigation: IReactNavigationPlug }
const CreatePodScreen = ({ navigation }: Props) => {
    const dispatch = useDispatch()
    const [errorMessage, setErrorMessage] = useState('')
    const [podName, setPodName] = useState('')
    const [podSlug, setPodSlug] = useState('')
    const [podDesc, setPodDesc] = useState('')
    const [podHashtag, setPodHashtag] = useState('')
    const [podHashtags, setPodHashtags] = useState<Array<string>>([])
    const [isHashtagsSelected, setIsHashtagsSelected] = useState<boolean>(false)
    const [isHashTagsVisible, setIsHashTagsVisible] = useState<boolean>(true)

    const backButtonCallback = () => {
        navigation.goBack()
        // dispatch({
        //     type: TOGGLE_BOTTOM_BAR_VISIBLE,
        //     payload: true,
        // })
        dispatch({
            type: SET_CURRENT_ROUTE,
            payload: ROUTES.PODSLIST_SCREEN,
        })
    }
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', backButtonCallback)
    })

    const hashtagsInputRef = React.createRef<any>()
    const scrollViewRef = useRef<any>(null)

    const scrollToBottom = () => {
        // this scrolls scroll view to bottom to not hide the hashtags when they are selecetded
        scrollViewRef?.current?.scrollToEnd({ animated: 'true' })
    }

    const writePodName = (v: string) => {
        setPodName(v)
        setPodSlug(v.replace(/\s/g, '').toLowerCase())
    }

    const writePodSlug = (v: string) => {
        setPodSlug(
            v
                .replace(/\s/g, '')
                .replace(/@/g, '')
                .toLowerCase()
        )
    }

    const writePodHashtag = (v: string) => {
        setPodHashtag(
            v
                .replace(/\s/g, '')
                .replace(/@/g, '')
                .toLowerCase()
        )
    }

    const addHashtag = () => {
        setPodHashtags([
            ...podHashtags.filter(p => p !== podHashtag && p),
            podHashtag,
        ])
        setPodHashtag('')
        const input = hashtagsInputRef.current
        if (input) {
            input.focus()
        }
    }

    const WrappedIcon = (style: object) => {
        return (
            <TouchableOpacity onPress={addHashtag}>
                <AddIcon {...style} />
            </TouchableOpacity>
        )
    }

    const submitEditing = () => {
        Keyboard.dismiss()
        addHashtag()
    }

    const removeHashtag = (hashtag: string) => () => {
        setPodHashtags(podHashtags.filter(p => p !== hashtag && p))
    }

    const [createPod, { loading, error }] = useMutation(CREATE_POD)

    useEffect(() => {
        setErrorMessage((error?.message || '').replace('GraphQL error: ', ''))
    }, [error])

    const submitCreatePod = async () => {
        const mutationArgs: MutationCreatePodArgs = {
            name: podName,
            slug: podSlug,
            desc: podDesc,
            hashtags: podHashtags,
        }

        await createPod({
            variables: mutationArgs,
            refetchQueries: ['listMyPods'],
        })
        setPodHashtag('')
        setPodHashtags([])
        setPodName('')
        setPodDesc('')
        setPodSlug('')
        navigation.navigate(ROUTES.PODSLIST_SCREEN)
        dispatch({
            type: SET_CURRENT_ROUTE,
            payload: ROUTES.PODSLIST_SCREEN,
        })
    }

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
                        navigation.navigate(ROUTES.CREATEPOD_SCREEN)
                    }}
                >
                    Back
                </Button>
            </View>
        )
    }

    const renderCreateButton = () => {
        if (loading) {
            return (
                <View style={Styles.spinnerWrap}>
                    <Spinner size="medium" />
                </View>
            )
        }
        const formsFilledOut = podName && podSlug && podHashtags.length > 0
        if (formsFilledOut) {
            return (
                <Button
                    onPress={submitCreatePod}
                    size="large"
                    style={Styles.create}
                >
                    CREATE NEW POD
                </Button>
            )
        }
        return (
            <Button disabled={true} size="large" style={Styles.create}>
                CREATE NEW POD
            </Button>
        )
    }

    const onHashtagFocus = () => {
        // show the keyboard filler so that hashtags are not covered by keyboard
        setIsHashtagsSelected(true)
        // scroll to the end of the scrollview
        setTimeout(() => scrollToBottom(), 30)
    }

    const returnExtraPrompt = () => {
        const txt = !isHashTagsVisible
            ? `... show all (${podHashtags.length})`
            : '... hide'
        return (
            <Text
                style={Styles.podHashTagStyle}
                onPress={() => setIsHashTagsVisible(!isHashTagsVisible)}
            >
                {txt}
            </Text>
        )
    }

    return (
        <SafeAreaView style={Styles.safearea}>
            <Header
                title="Start new pod"
                onBack={backButtonCallback}
                action={{
                    icon: 'question-mark-circle-outline',
                    onPress: () => {
                        dispatch({
                            type: TOGGLE_FORCE_ONBOARDING,
                            payload: true,
                        })
                        navigation.navigate(ROUTES.POD_ONBOARDING.NAVIGATION, {
                            screen: ROUTES.POD_ONBOARDING.START_POD,
                        })
                    },
                }}
            />
            <Layout style={Styles.layout}>
                <ScrollView ref={scrollViewRef}>
                    <Text category="h6">Step 1</Text>
                    <Text category="h5">Name Your Pod</Text>

                    <WhiteSpace />
                    <Input
                        value={podName}
                        autoCorrect={false}
                        placeholder="Pod Name"
                        onChangeText={writePodName}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        size="large"
                        style={Styles.input}
                        maxLength={40}
                    />
                    <Input
                        value={`@ ${podSlug}`}
                        onChangeText={writePodSlug}
                        autoCorrect={false}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        size="large"
                        maxLength={20}
                    />
                    <WhiteSpace />
                    <WhiteSpace />
                    <WhiteSpace />
                    <WhiteSpace />
                    <WhiteSpace />
                    <Text category="h6">Step 2</Text>
                    <Text category="h5">Set Pod Guidelines</Text>
                    <WhiteSpace />
                    <Input
                        value={podDesc}
                        autoCorrect={false}
                        placeholder="What times should posts be dropped? timezones? (max 300 char)"
                        onChangeText={setPodDesc}
                        onBlur={() => Keyboard.dismiss()}
                        // onSubmitEditing={() => Keyboard.dismiss()}
                        size="large"
                        style={Styles.input}
                        maxLength={300}
                        multiline
                    />
                    <WhiteSpace />
                    <WhiteSpace />
                    <WhiteSpace />
                    <WhiteSpace />
                    <WhiteSpace />
                    <Text category="h6">Step 3</Text>
                    <Text category="h5">Add hashtags</Text>
                    <WhiteSpace />
                    <Input
                        value={podHashtag}
                        placeholder="Add hashtags..."
                        // icon={AddIcon}
                        icon={WrappedIcon}
                        autoCorrect={false}
                        ref={hashtagsInputRef}
                        onIconPress={() => addHashtag()}
                        onChangeText={writePodHashtag}
                        onFocus={onHashtagFocus}
                        onBlur={() => setIsHashtagsSelected(false)}
                        onSubmitEditing={submitEditing}
                        size="large"
                        style={Styles.input}
                        maxLength={20}
                    />
                    <Layout style={Styles.pills}>
                        {podHashtags
                            .filter(p => p)
                            .reverse()
                            .slice(0, isHashTagsVisible ? undefined : 6)
                            .map(hashtag => (
                                <View key={hashtag} style={Styles.pill}>
                                    <View style={Styles.removeButtonWrap}>
                                        <Text
                                            onPress={removeHashtag(hashtag)}
                                            style={Styles.removeButton}
                                        >
                                            x
                                        </Text>
                                    </View>
                                    <Text style={Styles.hashtag}>
                                        {hashtag}
                                    </Text>
                                </View>
                            ))}
                        {podHashtags &&
                            podHashtags.length > 6 &&
                            returnExtraPrompt()}
                    </Layout>
                    {isHashtagsSelected ? (
                        <View style={Styles.keyBoardFill} />
                    ) : null}
                </ScrollView>
                <WhiteSpace />
                <WhiteSpace />
                {renderCreateButton()}
            </Layout>
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
        justifyContent: 'space-between',
        alignItems: 'stretch',
        padding: 20,
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
    pills: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 30,
    },
    pill: {
        padding: 7,
        backgroundColor: COLORS.BLUE['400'],
        alignSelf: 'flex-start',
        marginBottom: 10,
        marginRight: 20,
        borderRadius: 10,
        minWidth: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hashtag: {
        flexWrap: 'wrap',
        color: COLORS.WHITE['100'],
        fontWeight: 'bold',
        textAlignVertical: 'center',
        textAlign: 'center',
    },
    removeButtonWrap: {
        borderRadius: 15,
        backgroundColor: COLORS.RED['300'],
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -5,
        right: -12,
        width: 22,
        height: 22,
        // paddingBottom: 5,
        // paddingHorizontal: 2,
    },
    removeButton: {
        // flex: 1,
        // width: 22,
        // height: 22,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: COLORS.WHITE['100'],
        fontWeight: 'bold',
    },
    input: {
        marginTop: 10,
        textAlign: 'left',
    },
    create: {
        borderRadius: 10,
    },
    spinnerWrap: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyBoardFill: {
        // this literally is just to fill the space from the keyboard so that
        // hashtag input is not covered
        height: 160,
    },
    podHashTagStyle: {
        color: COLORS.BLUE['300'],
        marginTop: 8,
    },
})

export default CreatePodScreen
