import { gql } from 'apollo-boost'

export const DROP_POST_ONBOARDING = gql`
    mutation updateOnboardingSchedule($onboardingEvent: String!) {
        updateOnboardingSchedule(onboardingEvent: $onboardingEvent)
    }
`

export const NEW_DROP_LESSON_ONBOARDING_EVENT = 'newDropLesson'
