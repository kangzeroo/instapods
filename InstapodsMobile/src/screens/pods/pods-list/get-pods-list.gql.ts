import { gql } from 'apollo-boost'

export const GET_POD_LIST = gql`
    query listMyPods {
        listMyPods {
            id
            name
            slug
            karma
            members
            publicDescription
            image {
                height
                width
                uri
            }
            hashtags
            isPublic
            recentDrops {
                id
                userId
                username
                title
                desc
                contentUrl
                scheduledDate
                droppedDate
                image {
                    height
                    width
                    uri
                }
            }
        }
    }
`
