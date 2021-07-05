import { gql } from 'apollo-boost'

export const GET_POD_AS_MEMBER = gql`
    query getPodDetailsAsMember($podId: String!) {
        getPodDetailsAsMember(podId: $podId) {
            id
            name
            slug
            publicDescription
            privateDescription
            image {
                height
                width
                uri
            }
            hashtags
            admins {
                id
                username
                image {
                    height
                    width
                    uri
                }
                isPublic
                isOnline
                karma
            }
            members {
                id
                username
                image {
                    height
                    width
                    uri
                }
                isPublic
                isOnline
                karma
            }
            isPublic
            karma
            recentDrops {
                id
                userId
                username
                contentUrl
                image {
                    height
                    width
                    uri
                }
                title
                desc
                scheduledDate
                droppedDate
            }
        }
    }
`
export const queryName = 'GET_POD_AS_MEMBER'
