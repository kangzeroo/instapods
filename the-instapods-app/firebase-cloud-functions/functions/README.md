# Instapods Cloud Functions

This document defines how to develop, test & deploy Firebase Cloud Functions.

## Index of Cloud Functions

### HTTP Gateway

To see our client-server interactions, check out the GraphQL API spec located at `firebase-cloud-functions/functions/src/fn/graphql/README.md`.

- `/graphql` for production serving of GQL w/o introspection. Handles client-server interactions.
- `/graphql-playground` for production debugging of GQL w/ introspection
- `/onApifyCrawled` has to be set to [pubically invokable](https://cloud.google.com/run/docs/authenticating/public)

## Firestore Triggers

- `onJoinReceipt`

## Auth Triggers

- `createNewUser` for when a new user signs up

## External APIs

- `Stripe` tbd
