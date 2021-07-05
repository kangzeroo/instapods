import { gql } from 'apollo-boost'

export const GET_MY_PROFILE = gql`
    query getMyProfile {
        getMyProfile {
            id
            username
            image {
                height
                width
                uri
            }
            isPublic
            isOnline
            isVerified
            verificationCode
            karma
            drops {
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
            }
            onboardingSchedule {
                welcomeLesson
                agreeToToC
                newDropLesson
                newPodLesson
            }
        }
    }
`
