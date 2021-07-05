const functions = require("firebase-functions");
// const admin = require('firebase-admin')
// const db = admin.database()

// @ts-ignore
// type DataSnapshot = firebase.database.DataSnapshot

/**
 * @ignore
 */
const logging = functions.https.onRequest(async (req: any, res: any) => {
  console.log("------ LOGGED EVENT");
  console.log(req.body);
  return;
});

export default logging;
