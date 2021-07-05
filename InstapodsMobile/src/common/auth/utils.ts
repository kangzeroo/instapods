import { GoogleSignin } from '@react-native-community/google-signin'
import auth, { firebase } from '@react-native-firebase/auth'
// import { isCompositeType } from 'graphql'
import appleAuth, {
    AppleAuthRequestScope,
    AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication'
import { WEB_CLIENT_ID } from '../constants'

// sign in with apple: https://github.com/invertase/react-native-apple-authentication/blob/master/docs/FIREBASE.md
// https://github.com/invertase/react-native-apple-authentication
// npm: https://www.npmjs.com/package/@invertase/react-native-apple-authentication

export async function loginWithGoogle() {
    // eslint-disable-next-line no-useless-catch
    try {
        await GoogleSignin.configure({
            webClientId: WEB_CLIENT_ID,
            offlineAccess: false,
            scopes: ['profile', 'email'],
        })
    } catch (err) {
        // google pop up error
        throw err
    }

    const {
        // accessToken,
        idToken,
    } = await GoogleSignin.signIn()
    const credential = firebase.auth.GoogleAuthProvider.credential(
        idToken
        // accessToken
    )

    // eslint-disable-next-line no-useless-catch
    try {
        return await auth().signInWithCredential(credential)
    } catch (err) {
        // google login error
        throw err
    }
}

/**
 * Note the sign in request can error, e.g. if the user cancels the sign-in.
 * Use `AppleAuthError` to determine the type of error, e.g. `error.code === AppleAuthError.CANCELED`
 */
export async function onAppleButtonPress() {
    // 1). start a apple sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
            AppleAuthRequestScope.EMAIL,
            AppleAuthRequestScope.FULL_NAME,
        ],
    })

    // 2). if the request was successful, extract the token and nonce
    const { identityToken, nonce } = appleAuthRequestResponse

    // can be null in some scenarios
    if (identityToken) {
        // 3). create a Firebase `AppleAuthProvider` credential
        const appleCredential = firebase.auth.AppleAuthProvider.credential(
            identityToken,
            nonce
        )

        // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
        //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
        //     to link the account to an existing user
        const userCredential = await firebase
            .auth()
            .signInWithCredential(appleCredential)

        // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger
        console.warn(
            `Firebase authenticated via Apple, UID: ${userCredential.user.uid}`
        )
    } else {
        // handle this - retry?
        // throw new Error('oops')
        console.log('a problem... null returned from apple.')
    }
}
