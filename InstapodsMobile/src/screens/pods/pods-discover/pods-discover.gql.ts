import { gql } from 'apollo-boost'

export const DISCOVER_POD = gql`
    query discoverPublicPod($slug: String!) {
        discoverPublicPod(slug: $slug) {
            id
            slug
            name
            publicDescription
            image {
                uri
                height
                width
            }
            recentDropsCount
            membersCount
        }
    }
`

export const JOIN_POD = gql`
    mutation joinPod($podId: String!) {
        joinPod(podId: $podId)
    }
`
