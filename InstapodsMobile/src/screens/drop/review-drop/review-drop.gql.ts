import { gql } from 'apollo-boost'

export const REVIEW_DROP = gql`
    query viewMyDropResults($dropId: String!) {
        viewMyDropResults(dropId: $dropId) {
            id
            userId
            username
            contentUrl
            image {
                uri
                width
                height
            }
            title
            desc
            droppedDate
            hashtags
            scheduledDate
            isPublic
            pods {
                id
                name
                slug
            }
            status
            engagements {
                id
                engagerUsername
                interactionType
                contents
                timestamp
            }
        }
    }
`
