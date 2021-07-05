const functions = require('firebase-functions')
const admin = require('firebase-admin')
// @ts-ignore
type DataSnapshot = firebase.database.DataSnapshot

/**
 * @ignore
 */
const addMessageFn = functions.https.onRequest(async (req: any, res: any) => {
    const text = req.query.text
    const snapshot = await addMessage(text)
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref.toString())
})

/**
 * Take the text parameter passed to this HTTP endpoint and insert it into the
 * Realtime Database under the path `/messages/:pushId/original`
 * Then triggers {@link modifyMessage}
 *
 * @category Firebase Cloud
 */
const addMessage = async (text: string): DataSnapshot => {
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    const snapshot = await admin
        .database()
        .ref('/messages')
        .push({ original: text })
    return snapshot
}

export default addMessageFn
