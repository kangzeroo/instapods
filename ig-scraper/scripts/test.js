require('dotenv').config()
const ApifyClient = require('apify-client');

const apifyClient = new ApifyClient({
  userId: process.env.APIFY_USERID,
  token: process.env.APIFY_TOKEN,
});


// // Grabs the Instagram Profile of a user
// const run = async () => {
//     const runInfo = await apifyClient.acts.runAct({
//         actId: "599Fi8BXZsnYrA9Xz",
//         body: `
//             {
//                 "searchType": "user",
//                 "directUrls": [
//                     "https://www.instagram.com/yuhoneyy/"
//                 ],
//                 "resultsType": "details",
//                 "resultsLimit": 30,
//                 "proxy": {
//                     "useApifyProxy": true,
//                     "apifyProxyGroups": []
//                 }
//             }
//         `,
//         contentType: 'application/json; charset=utf-8',
//         waitForFinish: 30
//     })
//     console.log("============== runInfo ==============")
//     console.log(runInfo)
//     const datasetInfo = await apifyClient.datasets.getItems({ datasetId: runInfo.defaultDatasetId });
//     console.log("============== datasetInfo ==============")
//     console.log(datasetInfo)
//     console.log("============== latestPosts ==============")
//     console.log(datasetInfo.items[0].latestPosts[0])
// }
// run()




// ============== runInfo ==============
// {
//   id: 'oKGd5Gji8WMt9JEWD',
//   actId: '599Fi8BXZsnYrA9Xz',
//   userId: 'bcMJ36EfCjQXCsJgt',
//   startedAt: 2020-03-18T02:43:30.961Z,
//   finishedAt: 2020-03-18T02:43:38.417Z,
//   status: 'SUCCEEDED',
//   meta: {
//     origin: 'API',
//     userAgent: 'ApifyClient/0.6.0 (Darwin; Node/v13.6.0)'
//   },
//   stats: {
//     inputBodyLen: 186,
//     restartCount: 0,
//     workersUsed: 1,
//     initPrepSecs: 0.004,
//     initImagePullSecs: 1.197,
//     initContainerCreateSecs: 0.348,
//     initContainerStartSecs: 0.867,
//     memAvgBytes: 90804258.66484126,
//     memMaxBytes: 226828288,
//     memCurrentBytes: 0,
//     cpuAvgUsage: 30.077646708900076,
//     cpuMaxUsage: 161.59604187852224,
//     cpuCurrentUsage: 0,
//     netRxBytes: 1911159,
//     netTxBytes: 30860,
//     durationMillis: 7296,
//     runTimeSecs: 7.296,
//     metamorph: 0,
//     readyTimeSecs: 0.16,
//     initTotalSecs: 2.416,
//     emfileError: false,
//     computeUnits: 0.008106666666666667
//   },
//   options: {
//     build: 'latest',
//     timeoutSecs: 3600,
//     memoryMbytes: 4096,
//     diskMbytes: 8192
//   },
//   buildId: 'HozNqv3fmT6YNtLKh',
//   exitCode: 0,
//   defaultKeyValueStoreId: 'JZ8hQOtuAXxlbN8UL',
//   defaultDatasetId: 'h8ggbKgMvmwW50Epr',
//   defaultRequestQueueId: 'SuEYwK8uXWozoYS55',
//   buildNumber: '0.0.6',
//   containerUrl: 'https://mr4tyjrygu3t.runs.apify.net'
// }
// ============== datasetInfo ==============
// {
//   items: [
//     {
//       '#debug': [Object],
//       id: '367328986',
//       username: 'yuhoneyy',
//       fullName: '✿ EᐯITᗩ 宇涵| TOᖇOᑎTO ✿',
//       biography: '📩 : DM/ email for collaboration inquiries \n' +
//         '📍: Taiwanese born in Thailand based in Toronto and Singapore 🇹🇼🇹🇭🇨🇦🇸🇬\n' +
//         '🐶: @yuyupompom_\n' +
//         '⬇️',
//       externalUrl: 'https://donate.wwf.org.au/donate/2019-trees-appeal-koala-crisis',
//       externalUrlShimmed: 'https://l.instagram.com/?u=https%3A%2F%2Fdonate.wwf.org.au%2Fdonate%2F2019-trees-appeal-koala-crisis&e=ATM6W4bdQMezlqeHnpy5VsCsZKVJwxXIGcPasmelytzTJ5LvXYYfX6mc5hA6AqRcpW2hrgZl&s=1',
//       followersCount: 48388,
//       followsCount: 1144,
//       hasChannel: false,
//       highlightReelCount: 12,
//       isBusinessAccount: false,
//       joinedRecently: false,
//       businessCategoryName: null,
//       private: false,
//       verified: false,
//       profilePicUrl: 'https://scontent-iad3-1.cdninstagram.com/v/t51.2885-19/s150x150/84845684_568828914053785_7270748452324114432_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_ohc=I3w8slRm8TAAX91uIfs&oh=0fef0ed8f67cabe4b6cb09dccfbe70bc&oe=5EA02021',
//       profilePicUrlHD: 'https://scontent-iad3-1.cdninstagram.com/v/t51.2885-19/s320x320/84845684_568828914053785_7270748452324114432_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_ohc=I3w8slRm8TAAX91uIfs&oh=3232c49a752fd64ebe0ac137143615f0&oe=5E9C5CD1',
//       facebookPage: null,
//       igtvVideoCount: 0,
//       latestIgtvVideos: [],
//       postsCount: 195,
//       latestPosts: [Array]
//     }
//   ],
//   total: 1,
//   offset: 0,
//   count: 1,
//   limit: 999999999999
// }
// ============== latestPosts ==============
// {
//   type: 'Sidecar',
//   shortCode: 'B90UUunHYgZ',
//   caption: 'I did my makeup and showed my brother, he said I looked like the mom from Addams family. 🤔 hmm not what I was going for but okayyyyy 😅',
//   commentsCount: 125,
//   dimensionsHeight: 1350,
//   dimensionsWidth: 1080,
//   displayUrl: 'https://scontent-lax3-2.cdninstagram.com/v/t51.2885-15/e35/p1080x1080/90062351_211214593621543_5716072644592377382_n.jpg?_nc_ht=scontent-lax3-2.cdninstagram.com&_nc_cat=107&_nc_ohc=GqX0R3aCPX4AX96Ym9d&oh=c20e0df9eee63d98bb8bc59c11915934&oe=5EA01A55',
//   likesCount: 2021,
//   timestamp: '2020-03-17T02:09:23.000Z',
//   locationName: 'Toronto, Ontario'
// }



// const DROP_ID = "1111111"
// const DROPPER_ID = "222222222"
// const run = async () => {
//     const runInfo = apifyClient.acts.runAct({
//         actId: "599Fi8BXZsnYrA9Xz",
//         body: `
//             {
//                 "searchType": "user",
//                 "directUrls": [
//                     "https://www.instagram.com/p/B9nW6N1nbDt/"
//                 ],
//                 "resultsType": "comments",
//                 "resultsLimit": 300,
//                 "proxy": {
//                 "useApifyProxy": true,
//                 "apifyProxyGroups": []
//                 }
//             }
//         `,
//         webhooks: [
//             {
//                 eventTypes: ["ACTOR.RUN.SUCCEEDED"],
//                 requestUrl: `https://us-central1-the-instapods-app.cloudfunctions.net/onApifyCrawled?dropId=${DROP_ID}&dropperId=${DROPPER_ID}`
//             }
//         ],
//         contentType: 'application/json; charset=utf-8',
//         waitForFinish: 30
//     })
//     console.log("============== runInfo ==============")
//     console.log(runInfo)
//     // console.log(runInfo)
//     // const datasetInfo = await apifyClient.datasets.getItems({ datasetId: runInfo.defaultDatasetId });
//     // console.log("============== datasetInfo ==============")
//     // console.log(datasetInfo)
//     // console.log("============== latestPosts ==============")
//     // console.log(datasetInfo.items[0].latestPosts[0])
// }
// run()




const DROP_ID = "1111111"
const DROPPER_ID = "222222222"
const run = async () => {
    const runInfo = await apifyClient.acts.runAct({
        actId: "599Fi8BXZsnYrA9Xz",
        body: `
            {
                "searchType": "user",
                "directUrls": [
                "https://www.instagram.com/p/B9nW6N1nbDt/"
                ],
                "resultsType": "details",
                "resultsLimit": 1,
                "proxy": {
                "useApifyProxy": true,
                "apifyProxyGroups": []
                }
            }
        `,
        contentType: 'application/json; charset=utf-8',
        waitForFinish: 30
    })
    console.log("============== runInfo ==============")
    console.log(runInfo)
    console.log(runInfo)
    const datasetInfo = await apifyClient.datasets.getItems({ datasetId: runInfo.defaultDatasetId });
    console.log("============== datasetInfo ==============")
    console.log(datasetInfo)
    console.log("============== taggedUsers ==============")
    console.log(datasetInfo.items[0].taggedUsers[0])
    console.log("============== displayResourceUrls ==============")
    console.log(datasetInfo.items[0].displayResourceUrls[0])
}
run()


// {
//     items: [
//       {
//         '#debug': [Object],
//         type: 'Sidecar',
//         shortCode: 'B9nW6N1nbDt',
//         caption: 'It’s finally getting warmer out, that means it’s time to hit the gym 💪🏽',
//         commentsCount: 174,
//         dimensionsHeight: 1350,
//         dimensionsWidth: 1080,
//         displayUrl: 'https://scontent-lax3-2.cdninstagram.com/v/t51.2885-15/e35/p1080x1080/89407506_1074993169548327_4656351276316610845_n.jpg?_nc_ht=scontent-lax3-2.cdninstagram.com&_nc_cat=1&_nc_ohc=Y4xeV6g7Xv8AX8voLgD&oh=30549bc68106af12a6fa50d960c8b33b&oe=5E9AF0C2',
//         likesCount: 6751,
//         timestamp: '2020-03-12T01:21:51.000Z',
//         locationName: 'Toronto, Ontario',
//         ownerFullName: '♥ ✿ EᐯITᗩ 宇涵| TOᖇOᑎTO ✿ ♥',
//         captionIsEdited: false,
//         hasRankedComments: false,
//         commentsDisabled: false,
//         displayResourceUrls: [Array],
//         locationSlug: 'toronto-ontario',
//         ownerUsername: 'yuhoneyy',
//         isAdvertisement: false,
//         taggedUsers: [Array],
//         latestComments: []
//       }
//     ],
//     total: 0,
//     offset: 0,
//     count: 0,
//     limit: 999999999999
//   }