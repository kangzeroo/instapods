const admin = require('firebase-admin')
const moment = require('moment')

const serviceAccount = require("./env.json");

const DropStatus = {
    PENDING: 'PENDING',
    RELEASED: 'RELEASED',
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'the-instapods-app.appspot.com'
});

const firestore = admin.firestore()

const queryDat = async () => {
    // console.log(admin.firestore.FieldValue.serverTimestamp())
    // const ts = new Date(moment.utc().subtract(16, 'years').format("YYYY-MM-DDTHH:mm:ss.SSS"))
    // console.log(ts)
    // console.log(admin.firestore.Timestamp.fromDate(ts))
    // console.log(new Date())
    // console.log(admin.firestore.Timestamp.fromDate(new Date()))
    const afterTimestamp = admin.firestore.Timestamp.fromDate(new Date(moment.utc().subtract(16, 'years').format("YYYY-MM-DDTHH:mm:ss.SSS")))
    // const beforeTimestamp = admin.firestore.Timestamp.fromDate(new Date(moment.utc().subtract(14, 'minutes').format("YYYY-MM-DDTHH:mm:ss.SSS")))
    const snapshot = await firestore
        .collection('drops')
        .where(
            'droppedDate',
            '>=',
            afterTimestamp
        )
        // .where(
        //     'droppedDate',
        //     '<=',
        //     beforeTimestamp
        // )
        // .where('status', '==', DropStatus.RELEASED)
        // .where('crawlSchedule.10', '==', false)
        .get()
    const drops = []
    snapshot.forEach((doc) => {
        drops.push(doc.data())
    })
    console.log(drops)
}
queryDat()

// $ node query.js