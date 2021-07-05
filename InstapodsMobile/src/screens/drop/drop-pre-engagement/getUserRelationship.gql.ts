import { gql } from 'apollo-boost'

export const USER_RELATIONSHIP_QUERY = gql`
    query getUserRelationshipProfile($theirId: String!) {
        getUserRelationshipProfile(theirId: $theirId) {
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
    }
`
