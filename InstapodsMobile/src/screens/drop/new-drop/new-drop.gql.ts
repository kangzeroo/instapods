import { gql } from 'apollo-boost'

export const CREATE_DROP = gql`
    mutation createDrop(
        $contentUrl: String!
        $title: String!
        $desc: String!
        $podIds: [String!]!
    ) {
        createDrop(
            contentUrl: $contentUrl
            title: $title
            desc: $desc
            podIds: $podIds
        )
    }
`

export const RELEASE_DROP = gql`
    mutation releaseDrop($dropId: String!) {
        releaseDrop(dropId: $dropId)
    }
`
