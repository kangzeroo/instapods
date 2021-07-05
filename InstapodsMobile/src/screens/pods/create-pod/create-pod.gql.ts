import { gql } from 'apollo-boost'

export const CREATE_POD = gql`
    mutation createPod(
        $name: String!
        $slug: String!
        $desc: String!
        $hashtags: [String!]!
    ) {
        createPod(name: $name, slug: $slug, desc: $desc, hashtags: $hashtags)
    }
`
