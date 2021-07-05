import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { Divider, Layout, Text, Button } from '@ui-kitten/components'
import { useQuery } from '@apollo/react-hooks'
import {
    useDispatch,
    // useSelector
} from 'react-redux'
import moment from 'moment'
import auth from '@react-native-firebase/auth'
import { Header } from '../../../common/components/header.component'
import { IReactNavigationPlug, IDropStorageItem } from '../../../types.any'
import { GET_MY_PROFILE } from '../../profile/profile-activity/profile-activity.gql'
import {
    SET_USER_PARAMS,
    SET_DROP_STORAGE_ARRAY,
} from '../../../redux/actions.redux'
// import { IReduxState } from '../../../redux/state.redux'
import {
    setDropsToStorage,
    getDropsFromStorage,
} from '../../drop/async-storage.utility'
import { COLORS } from '../../../styles'
import { PrivateUser } from '../../../generated-types'
import { ROUTES } from '../../../common/constants'
import Typewriter from '../../../common/components/typewriter.component'

type Props = { navigation: IReactNavigationPlug }
const InitialLoadingScreen = ({ navigation }: Props) => {
    const dispatch = useDispatch()
    const [enabled, setEnabled] = useState(true)
    const loadPeriod: number = 2000 // try to laod every 2s
    const nMaxLoad: number = 10 // only try to laod for a maximum of nMaxLoad * loadPeriod before kicking back
    const [nLoads, setNLoads] = useState(1)
    const [verifiedUser, setVerifiedUser] = useState(null)
    // const currentRoute = useSelector((state: IReduxState) => state.currentRoute)

    useEffect(() => {
        // load the completedDrops and set to redux also
        // we really only need to load this one time here - its a list of recent drops that have been completed/declined by the user
        // stored in AsyncStorage from react-native-comunity
        getDropsFromStorage(userId)
            .then(async (dataFromStorage: Array<IDropStorageItem>) => {
                // filter out all old dates, lets say just arbitrarily 15 days
                // NOTE: THIS MAY NEED TO BE IN SYNC WITH BACKEND scheduledRecentDropCleaner which is currently 2 weeks!!!
                // const filteredArr: Array<IDropStorageItem> = dataFromStorage.filter(
                //     (f: IDropStorageItem) => {
                //         const cutOffTime = moment()
                //             .subtract(15, 'd')
                //             .valueOf()
                //         return f.dateCreated > cutOffTime
                //     }
                // )
                // // assign it to redux to state.dataFromStorage
                // dispatch({
                //     type: SET_DROP_STORAGE_ARRAY,
                //     payload: filteredArr,
                // })
                dispatch({
                    type: SET_DROP_STORAGE_ARRAY,
                    payload: dataFromStorage,
                })
                // also, set the AsyncStorage:
                await setDropsToStorage(dataFromStorage, userId)
            })
            // eslint-disable-next-line no-console
            .catch(err => console.log(err))
    })

    useEffect(() => {
        if (
            enabled &&
            verifiedUser != null
            // currentRoute !== ROUTES.WELCOME_ONBOARDING.NEXT_STEPS && // HACK
            // currentRoute !== ROUTES.PODSLIST_SCREEN // HACK
        ) {
            // eslint-disable-next-line no-console
            console.log('initial-loading fuckery', enabled, verifiedUser)
            if (verifiedUser) {
                // eslint-disable-next-line no-console
                console.log('navigating to logged in section')
                navigation.navigate(ROUTES.LOGGED_IN_SECTION)
                setEnabled(false)
            } else {
                // eslint-disable-next-line no-console
                console.log('navigate to welcome on boarding')
                navigation.navigate(ROUTES.WELCOME_ONBOARDING.WELCOME)
                setEnabled(false)
            }
        }

        return () => {
            // eslint-disable-next-line no-console
            console.log('clean up')
            setEnabled(false)
        }
    }, [verifiedUser, navigation, enabled])

    const { loading, error, data, refetch } = useQuery(GET_MY_PROFILE)

    const isLoaded = data && data.getMyProfile

    if (!isLoaded && nLoads > nMaxLoad) {
        return (
            <View style={Styles.errorview}>
                <Text category="h2" style={Styles.errortitle}>
                    Ouch 🤕
                </Text>
                <Text style={Styles.errormessage}>
                    We&apos;re sorry but we can&apos;t load your profile right
                    now. Please log in again.
                </Text>
                <Button
                    status="warning"
                    onPress={() => {
                        navigation.navigate(ROUTES.LOGIN_SCREEN)
                        if (auth().currentUser) {
                            auth().signOut()
                        }
                    }}
                >
                    Login
                </Button>
            </View>
        )
    }

    // now if data is not loaded, we load it every period
    if (!isLoaded) {
        setTimeout(() => {
            // eslint-disable-next-line no-console
            console.log('... refetching...')
            refetch()
            setNLoads(nLoads + 1)
        }, loadPeriod)
    }

    if (loading || !isLoaded || !data || !data.getMyProfile) {
        return (
            <Layout style={Styles.loadingLayout}>
                <Typewriter />
            </Layout>
        )
    }

    if (error) {
        // navigation.navigate(ROUTES.LOGIN_SCREEN)
        return (
            <View style={Styles.errorview}>
                <Text category="h2" style={Styles.errortitle}>
                    Ouch 🤕
                </Text>
                <Text
                    style={Styles.errormessage}
                >{`${error.message}.  Click below to go back.`}</Text>
                <Button status="warning" onPress={() => navigation.goBack()}>
                    Back
                </Button>
            </View>
        )
    }

    const { id: userId, isVerified }: PrivateUser = data?.getMyProfile

    if (isVerified !== verifiedUser) {
        setVerifiedUser(isVerified)
    }

    dispatch({ type: SET_USER_PARAMS, payload: data.getMyProfile })

    return (
        <SafeAreaView style={Styles.safearea}>
            <Header
                alignment="start"
                title="Back"
                onBack={() => navigation.navigate(ROUTES.LOGIN_HOME_SCREEN)}
                action={{
                    icon: 'arrow-forward',
                    onPress: () => {
                        if (auth().currentUser) {
                            auth().signOut()
                        }
                        if (verifiedUser != null) {
                            if (verifiedUser) {
                                // eslint-disable-next-line no-console
                                console.log('navigating to logged in section')
                                navigation.navigate(ROUTES.LOGGED_IN_SECTION)
                            } else {
                                // eslint-disable-next-line no-console
                                console.log('navigate to welcome on boarding')
                                navigation.navigate(
                                    ROUTES.WELCOME_ONBOARDING.WELCOME
                                )
                            }
                        }
                    },
                }}
            />

            <Divider />
            <Layout style={Styles.layout}>
                <Typewriter />
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
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    loadingLayout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
})

export default InitialLoadingScreen
