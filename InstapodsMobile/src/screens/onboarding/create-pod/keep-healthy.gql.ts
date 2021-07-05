import { gql } from 'apollo-boost'

export const CREATE_POD_ONBOARDING = gql`
    mutation updateOnboardingSchedule($onboardingEvent: String!) {
        updateOnboardingSchedule(onboardingEvent: $onboardingEvent)
    }
`

export const NEW_POD_LESSON_ONBOARDING_EVENT = 'newPodLesson'
