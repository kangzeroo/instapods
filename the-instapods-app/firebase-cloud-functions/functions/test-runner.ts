// $ npx ts-node test-runner.ts

// initiate
// import * as functions from 'firebase-functions'
// import * as admin from 'firebase-admin'
// admin.initializeApp(functions.config().firebase)

// import
// const { createUser } = require('./src/firestore/user')

// run test
console.log(
    createUser({
        igHandle: 'viola.kim382',
        profileImg:
            'https://i.pinimg.com/originals/b4/ad/51/b4ad515b57e888aad334f66d07cfd765.jpg',
    })
)
