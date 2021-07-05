// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions')
import gqlServer from './server/graphql-server'

const server = gqlServer()
const graphql = functions.https.onRequest(server)

export default graphql
