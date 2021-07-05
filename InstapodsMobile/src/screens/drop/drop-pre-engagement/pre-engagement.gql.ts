import { gql } from 'apollo-boost'

export const VIEW_DROP_PREENGAGEMENT = gql`
    query viewDropPreEngagement($dropId: String!) {
        viewDropPreEngagement(dropId: $dropId) {
            id
            username
            contentUrl
            image {
                height
                width
                uri
            }
            title
            desc
            isPublic
            userId
            userKarma
            droppedDate
            userImage {
                height
                width
                uri
            }
        }
    }
`
