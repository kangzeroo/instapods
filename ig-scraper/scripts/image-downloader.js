var https = require('https'),                                                
    Stream = require('stream').Transform,                                  
    fs = require('fs');               
    admin = require("firebase-admin");

var serviceAccount = require("./env.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'the-instapods-app.appspot.com'
});

// var bucket = admin.storage().bucket("the-instapods-app.appspot.com");

// const uploadFile = async (tempFilePath) => {
//     const x = await bucket.upload(tempFilePath, {
//         destination: "test/image-2.png",
//         metadata: {
//             contentType: 'image/png',
//         },
//         public: true
//     });
//     console.log(x[0].metadata.mediaLink)
// }
// uploadFile("./image.png")


// const uploadFileFromUrl = async (url) => {
//     const x = await bucket.createWriteStream(url, {
//         destination: "test/image-4.png",
//         metadata: {
//             contentType: 'image/png',
//         },
//     })
//     console.log(x[0].metadata)
// }
// uploadFileFromUrl("https://scontent-lax3-2.cdninstagram.com/v/t51.2885-19/s150x150/73455962_801166660337413_2562933841677254656_n.jpg?_nc_ht=scontent-lax3-2.cdninstagram.com&_nc_ohc=eVi5VWx2YkgAX_y2giq&oh=f5a19bb3a54072f9acaa9147e720f020&oe=5EA109CF")


// var url = 'https://scontent-lax3-2.cdninstagram.com/v/t51.2885-19/s150x150/73455962_801166660337413_2562933841677254656_n.jpg?_nc_ht=scontent-lax3-2.cdninstagram.com&_nc_ohc=eVi5VWx2YkgAX_y2giq&oh=f5a19bb3a54072f9acaa9147e720f020&oe=5EA109CF';                    
// https.request(url, function(response) {                                        
//   var data = new Stream();                                                    

//   response.on('data', function(chunk) {                                       
//     data.push(chunk);                                                         
//   });                                                                         

//   response.on('end', function() {                                             
//     fs.writeFileSync('image.png', data.read());                               
//   });                                                                         
// }).end();



// var storageRef = admin.storage().bucket()
// console.log(storageRef)
// var testImageRef = storageRef.child('test/image-test-2.png');
// const img = new File("./env.json")
// ref.put(img).then(function(snapshot) {
//     console.log('Uploaded a blob or file!');
//     snapshot.ref.getDownloadURL().then(function(downloadURL) {
//         console.log('File available at', downloadURL);
//       });
// });




// "https://www.googleapis.com/storage/v1/b/the-instapods-app.appspot.com/o/test%2Fimage.jpeg"
// "https://firebasestorage.googleapis.com/v0/b/the-instapods-app.appspot.com/o/test%2Fimage.png?alt=media&token=e4f4253c-7de5-4f64-95d0-b523a41255ad"







// how to do it from a cloud bucket
// // Download file from bucket.
// const bucket = admin.storage().bucket(fileBucket);
// const tempFilePath = path.join(os.tmpdir(), fileName);
// const metadata = {
//   contentType: contentType,
// };
// await bucket.file(filePath).download({destination: tempFilePath});
// console.log('Image downloaded locally to', tempFilePath);
// // Generate a thumbnail using ImageMagick.
// await spawn('convert', [tempFilePath, '-thumbnail', '200x200>', tempFilePath]);
// console.log('Thumbnail created at', tempFilePath);
// // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
// const thumbFileName = `thumb_${fileName}`;
// const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
// // Uploading the thumbnail.
// await bucket.upload(tempFilePath, {
//   destination: thumbFilePath,
//   metadata: metadata,
// });
// // Once the thumbnail has been uploaded delete the local file to free up disk space.
// return fs.unlinkSync(tempFilePath);



const uploadJSON = async (data) => {
    fs.writeFileSync('./test-karma-data.json', JSON.stringify(data));
    const bucket = admin.storage().bucket("the-instapods-app.appspot.com")
    const x = await bucket.upload('./test-karma-data.json', {
        destination: "test/test2-karma-data.json",
        metadata: {
            contentType: 'application/json',
        },
        public: true
    });
    console.log(x[0].metadata)
    return x[0].metadata.mediaLink
}

const readJSON = async (filePath) => {
    console.log('=------ readJSON')
    const bucket = admin.storage().bucket("the-instapods-app.appspot.com")
    await bucket.file(filePath).download({destination: './read-karma-data.json'});
    const json = require('./read-karma-data.json')
    console.log(json)
}

const x = async () => {
    // const link = await uploadJSON({
    //     name: "test upload",
    //     title: "support please"
    // })
    await readJSON("test/test-karma-data.json")
}
x()