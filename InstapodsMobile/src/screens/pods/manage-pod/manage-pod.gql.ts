import { gql } from 'apollo-boost'

export const LEAVE_POD = gql`
    mutation leavePod($podId: String!) {
        leavePod(podId: $podId)
    }
`

export const KICK_POD_MEMBERS = gql`
    mutation kickPodMembers($podId: String!, $offenderIds: [String!]!) {
        kickPodMembers(podId: $podId, offenderIds: $offenderIds)
    }
`

export const PROMOTE_POD_MEMBERS = gql`
    mutation promotePodMembers($podId: String!, $userIds: [String!]!) {
        promotePodMembers(podId: $podId, userIds: $userIds)
    }
`

export const DEMOTE_POD_MEMBERS = gql`
    mutation demotePodMembers($podId: String!, $userIds: [String!]!) {
        demotePodMembers(podId: $podId, userIds: $userIds)
    }
`

export const UPDATE_POD_PRIVATE_DESCRIPTION = gql`
    mutation updatePodPrivateDescription(
        $podId: String!
        $privateDescription: String!
    ) {
        updatePodPrivateDescription(
            podId: $podId
            privateDescription: $privateDescription
        )
    }
`
