import { gql } from 'apollo-boost'

export const JOIN_POD = gql`
    mutation joinPod($podId: String!) {
        joinPod(podId: $podId)
    }
`

export const GET_POD_AS_INVITEE = gql`
    query getPodDetailsAsInvitee($podId: String!) {
        getPodDetailsAsInvitee(podId: $podId) {
            id
            name
            slug
            publicDescription
            image {
                height
                width
                uri
            }
            hashtags
            membersCount
            karma
        }
    }
`
