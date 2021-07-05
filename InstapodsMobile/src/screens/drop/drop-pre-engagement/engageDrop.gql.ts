import { gql } from 'apollo-boost'

export const ENGAGE_DROP = gql`
    mutation engageDrop(
        $dropId: String!
        $dropperId: String!
        $engagerUsername: String!
        $interactionType: String!
        $contents: String!
    ) {
        engageDrop(
            dropId: $dropId
            dropperId: $dropperId
            engagerUsername: $engagerUsername
            interactionType: $interactionType
            contents: $contents
        )
    }
`
