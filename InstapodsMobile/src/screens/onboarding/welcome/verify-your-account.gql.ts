import { gql } from 'apollo-boost'

export const VERIFY_ACCOUNT = gql`
    mutation verifyAccount($username: String!) {
        verifyAccount(username: $username)
    }
`

export const UPDATE_FCM_TOKEN = gql`
    mutation updateUserPushNotificationToken($token: String!) {
        updateUserPushNotificationToken(token: $token)
    }
`
