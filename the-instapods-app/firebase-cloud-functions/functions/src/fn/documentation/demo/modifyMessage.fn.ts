// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions')
// @ts-ignore
type DataSnapshot = firebase.database.DataSnapshot
// @ts-ignore
type Context = firebase.database.Context

/**
 * @ignore
 */
const modifyMessageFn = functions.database
    .ref('/messages/{pushId}/original')
    .onCreate((snapshot: DataSnapshot, context: Context) => {
        const uppercase = modifyMessage(snapshot)
        return snapshot.ref.parent.child('uppercase').set(uppercase)
    })

/**
 * Listens for new messages added to `/messages/:pushId/original` and creates an
 * uppercase version of the message to `/messages/:pushId/uppercase`
 *
 * @category Firebase Cloud
 */
const modifyMessage = (snapshot: DataSnapshot): string => {
    return `${snapshot.val().toUpperCase()}-modified-demo`
}

export default modifyMessageFn
