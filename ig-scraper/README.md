# Actor - Instagram scraper

## Instagram scraper

Since Instagram has removed the option to load public data through its API, this actor should help replace this functionality. It allows you to scrape posts from a user's profile page, hashtag page or place. When a link to an Instagram post is provided, it can scrape Instagram comments.

The Instagram data scraper supports the following features:

- Scrape profiles - you can either scrape posts or get metadata from the profile

- Scrape hashtags - you can either scrape posts or scrape metadata from the hashtag

- Scrape places - you can either scrape posts or scrape metadata from the place

- Scrape comments - you can scrape comments from any post

Features **not** available in this scraper:

- Scrape Instagram followers - list of followers is accessible only after login, which this solution does not support

- Scrape Instagram following - list of followed profiles is accessible only after login, which this solution does not support

If you are interested in this solution and want to know more about how it works, I wrote a short introduction on [Apify blog](https://medium.com/p/21d05506aeb3).

## Instagram scraper - future

In the future, this solution will be extended with following features:

- Scraping and download of Instagram photos
- Scraping of Instagram stories

## Input parameters

The input of this scraper should be JSON containing the list of pages on Instagram that should be visited. Required fields are:

| Field | Type | Description |
| ----- | ---- | ----------- |
| search | String | (optional) Query to search Instagram for |
| searchType | String | (optional, required with search) What to search Instagram for, default is "hashtag", other options are "user" or "place"  |
| searchLimit | String | (optional) How many search results to process, default is 20, maximum is 100  |
| directUrls | Array | (optional) List of Instagram URLs |
| resultsType | String | What to scrape from each page, default is "posts" the other option is "comments" |
| resultsLimit | Integer | How many items should be loaded from each URL (limit is per page)  |
| proxy | Object | Proxy configuration |

This solution requires the use of **Proxy servers**, either your own proxy servers or you can use <a href="https://www.apify.com/docs/proxy">Apify Proxy</a>.

### Instagram scraper Input example
```json
{
    "search": "Náměstí míru",
    "searchType": "place",
    "searchLimit": 10,
    "directUrls": [ "https://www.instagram.com/teslamotors/" ],
    "resultsType": "posts",
    "resultsLimit": 100,
    "proxy": { "useApifyProxy": true, "apifyProxyGroups": [] }
}

```

## During the run

During the run, the actor will output messages letting you know what is going on. Each message always contains a short label specifying which page from the provided list is currently specified.
When items are loaded from the page, you should see a message about this event with a loaded item count and total item count for each page.

If you provide incorrect input to the actor, it will immediately stop with failure state and output an explanation of
what is wrong.

## Instagram export

During the run, the actor stores results into a dataset. Each item is a separate item in the dataset.

You can manage the results in any languague (Python, PHP, Node JS/NPM). See the FAQ or <a href="https://www.apify.com/docs/api" target="blank">our API reference</a> to learn more about getting results from this Instagram actor.

## Scraped Instagram posts
The structure of each item in Instagram posts looks like this:

```json
{
  "#debug": {
    "index": 1,
    "pageType": "user",
    "id": "teslamotors",
    "userId": "297604134",
    "userUsername": "teslamotors",
    "userFullName": "Tesla",
    "shortcode": "BwrsO1Bho2N",
    "postLocationId": "2172837629656184",
    "postOwnerId": "297604134"
  },
  "url": "https://www.instagram.com/p/BwrsO1Bho2N",
  "likesCount": 142707,
  "imageUrl": "https://scontent-ort2-2.cdninstagram.com/vp/ddc96ff719e514e118da40af30c21e44/5D625C61/t51.2885-15/e35/57840129_308705413159630_8358160330083042716_n.jpg?_nc_ht=scontent-ort2-2.cdninstagram.com",
  "firstComment": "Newly upgraded Model S and X drive units rolling down the production line at Gigafactory 1",
  "timestamp": "2019-04-25T14:57:01.000Z",
  "locationName": "Tesla Gigafactory 1",
  "ownerUsername": "teslamotors"
}
```

## Scraped Instagram comments
The structure of each item in Instagram comments looks like this:

```json
{
  "#debug": {
    "index": 13,
    "pageType": "post",
    "id": "Bw7jACTn3tC",
    "postCommentsDisabled": false,
    "postIsVideo": true,
    "postVideoViewCount": 418505,
    "postVideoDurationSecs": 13.05
  },
  "id": "17847980458427200",
  "text": "#thankyouavengers",
  "timestamp": null,
  "ownerId": "3821638094",
  "ownerIsVerified": false,
  "ownerUsername": "exelya_alvyolita",
  "ownerProfilePicUrl": "https://scontent-ort2-1.cdninstagram.com/vp/b12a3649da329b32a3d7f0d2127d5033/5D6141DD/t51.2885-19/s150x150/54446808_273968013485672_6984748001717649408_n.jpg?_nc_ht=scontent-ort2-1.cdninstagram.com"
}
```

## Scraped Instagram profile
The structure of each user profile looks like this:

```json
{
  "#debug": {
    "url": "https://www.instagram.com/avengers/"
  },
  "id": "6622284809",
  "username": "avengers",
  "fullName": "Avengers: Endgame",
  "biography": "Marvel Studios’ \"Avengers​: Endgame” is now playing in theaters.",
  "externalUrl": "http://www.fandango.com/avengersendgame",
  "externalUrlShimmed": "https://l.instagram.com/?u=http%3A%2F%2Fwww.fandango.com%2Favengersendgame&e=ATNWJ4avEN0vwSx1YQCqQqFJst7aAFzINa-BzGZLoTVrdC6sTRTmjM9QNgWKR3URJHMxwg9x",
  "followersCount": 8212505,
  "followsCount": 4,
  "hasChannel": false,
  "highlightReelCount": 3,
  "isBusinessAccount": true,
  "joinedRecently": false,
  "businessCategoryName": "Content & Apps",
  "private": false,
  "verified": true,
  "profilePicUrl": "https://scontent-ort2-2.cdninstagram.com/vp/eaea4675dc1e937f3b449dba21ac3867/5D5DF0E0/t51.2885-19/s150x150/54446499_2222190077828037_3317168817985028096_n.jpg?_nc_ht=scontent-ort2-2.cdninstagram.com",
  "profilePicUrlHD": "https://scontent-ort2-2.cdninstagram.com/vp/38a36006532165263f0d82c32de1d0ce/5D767E98/t51.2885-19/s320x320/54446499_2222190077828037_3317168817985028096_n.jpg?_nc_ht=scontent-ort2-2.cdninstagram.com",
  "facebookPage": null,
  "igtvVideoCount": 5,
  "latestIgtvVideos": [
    {
      "type": "Video",
      "shortCode": "Bwr3OkpnZZ5",
      "title": "Marvel Studios’ Avengers: Endgame | “Don’t Do It”",
      "caption": "Don’t do it. #DontSpoilTheEndgame",
      "commentsCount": 115,
      "commentsDisabled": false,
      "dimensionsHeight": 1333,
      "dimensionsWidth": 750,
      "displayUrl": "https://scontent-ort2-2.cdninstagram.com/vp/1c063ea4ff0e4768a852411c74470bae/5CCD7FE3/t51.2885-15/e35/58684999_167806787545179_7836940807335402934_n.jpg?_nc_ht=scontent-ort2-2.cdninstagram.com",
      "likesCount": 123,
      "videoDuration": 21.688,
      "videoViewCount": 77426
    },
    ...
  ],
  "postsCount": 274,
  "latestPosts": [
    {
      "type": "Video",
      "shortCode": "Bw7jACTn3tC",
      "caption": "“We need to take a stand.” Marvel Studios’ #AvengersEndgame is in theaters now. Get tickets: [link in bio]",
      "commentsCount": 1045,
      "dimensionsHeight": 750,
      "dimensionsWidth": 750,
      "displayUrl": "https://scontent-ort2-2.cdninstagram.com/vp/c336cf708e62596cd46879656f86ad70/5CCD112C/t51.2885-15/e35/57649006_653609661751971_8438348841277997450_n.jpg?_nc_ht=scontent-ort2-2.cdninstagram.com",
      "likesCount": 142707,
      "videoViewCount": 482810,
      "timestamp": "2019-05-01T18:44:12.000Z",
      "locationName": null
    },
    ...
  ]
}
```

## Scraped Instagram hashtag
The structure of each hashtag detail looks like this:

```json
{
  "#debug": {
    "url": "https://www.instagram.com/explore/tags/endgame/"
  },
  "id": "17843854051054595",
  "name": "endgame",
  "topPostsOnly": false,
  "profilePicUrl": "https://scontent-ort2-2.cdninstagram.com/vp/c3074c4492e7594fdd330ff8b81cf724/5D558BBC/t51.2885-15/e15/s150x150/58410922_577374706107933_1468173581283089454_n.jpg?_nc_ht=scontent-ort2-2.cdninstagram.com",
  "postsCount": 1510549,
  "topPosts": [
    {
      "type": "Image",
      "shortCode": "Bw9UYRrhxfl",
      "caption": "Here is the second part😂😂 Find the first part on the page\nGuess the pictures😏\n-\n-\n-\n#marvel #mcu #dceu #worldofdc #endgame #superhero #superheros #infinitywar #batman #superman #wonderwoman #iroman #captainamerica #thor #thanos #memes #news #dc #dcuniverse #power #funny #fun",
      "commentsCount": 9,
      "dimensionsHeight": 1326,
      "dimensionsWidth": 1080,
      "displayUrl": "https://scontent-ort2-2.cdninstagram.com/vp/4d67498d0bc033cbfdf8b666d0fce6d1/5D629B3E/t51.2885-15/e35/57216878_2119889691397544_8022105877563047858_n.jpg?_nc_ht=scontent-ort2-2.cdninstagram.com",
      "likesCount": 2342,
      "timestamp": "2019-05-02T11:14:55.000Z",
      "locationName": null
    },
    ...
  ],
  "latestPosts": [
    {
      "type": "Sidecar",
      "shortCode": "Bw9flNKl56O",
      "caption": "Mínimo lo se mi tributo a semejante peli pero bue algo quería hacer me llore la vidaaaaa #endgame #avengersendgame #avengers #thanos #ironman #hulk #thor #makeupcomic #makeup #moviemakeup #makeupeyes #makeupfantasy #makeupavengers #makeuphero",
      "commentsCount": 0,
      "dimensionsHeight": 936,
      "dimensionsWidth": 1080,
      "displayUrl": "https://scontent-ort2-2.cdninstagram.com/vp/d97b7e434dbbb4141552c9af9c8fb05b/5D5F34FD/t51.2885-15/e35/58087917_2268263940082789_7711745336102849043_n.jpg?_nc_ht=scontent-ort2-2.cdninstagram.com",
      "likesCount": 12312,
      "timestamp": "2019-05-02T12:52:48.000Z",
      "locationName": null
    },
    ...
  ]
}
```

## Scraped Instagram place
The structure of each place detail looks like this:

```json
{
  "#debug": {
    "url": "https://www.instagram.com/explore/locations/1017812091/namesti-miru/"
  },
  "id": "1017812091",
  "name": "Náměstí Míru",
  "public": true,
  "lat": 50.0753325,
  "lng": 14.43769,
  "slug": "namesti-miru",
  "description": "",
  "website": "",
  "phone": "",
  "aliasOnFacebook": "",
  "addressStreetAddress": "",
  "addressZipCode": "",
  "addressCityName": "Prague, Czech Republic",
  "addressRegionName": "",
  "addressCountryCode": "CZ",
  "addressExactCityMatch": false,
  "addressExactRegionMatch": false,
  "addressExactCountryMatch": false,
  "profilePicUrl": "https://scontent-ort2-2.cdninstagram.com/vp/aa8cc8c627cbddf3df270747223f5f23/5D68CDEA/t51.2885-15/e35/s150x150/57561454_2452560724777787_307886881124344332_n.jpg?_nc_ht=scontent-ort2-2.cdninstagram.com",
  "postsCount": 5310,
  "topPosts": [
    {
      "type": "Image",
      "shortCode": "Bw6lVVZhXXB",
      "caption": "🦋🦋🦋",
      "commentsCount": 3,
      "dimensionsHeight": 750,
      "dimensionsWidth": 750,
      "displayUrl": "https://scontent-ort2-2.cdninstagram.com/vp/03de7e9343f98fdf47513a0a944c427f/5D6656A8/t51.2885-15/e35/57561454_2452560724777787_307886881124344332_n.jpg?_nc_ht=scontent-ort2-2.cdninstagram.com",
      "likesCount": 345,
      "timestamp": "2019-05-01T09:45:20.000Z",
      "locationName": null
    },
    ...
  ],
  "latestPosts": [
    {
      "type": "Image",
      "shortCode": "Bw9KSlIhAc-",
      "caption": "#vinohradskaprincezna #nekdotomusikontrolovat #jestezememaji #jmenujusebufinka 🐶",
      "commentsCount": 0,
      "dimensionsHeight": 1080,
      "dimensionsWidth": 1080,
      "displayUrl": "https://scontent-ort2-2.cdninstagram.com/vp/0fa17a87dee94c0c63c8973c6c0677eb/5D59EE21/t51.2885-15/e35/57506136_399700847249384_6385808161520210872_n.jpg?_nc_ht=scontent-ort2-2.cdninstagram.com",
      "likesCount": 4546,
      "timestamp": "2019-05-02T09:46:45.000Z",
      "locationName": null
    },
    ...
  ]
}
```

## Scraped Instagram post
The structure of each post detail looks like this:

```json
{
  "#debug": {
    "url": "https://www.instagram.com/p/BxNXsMxHPxP",
    "loadedUrl": "https://www.instagram.com/p/BxNXsMxHPxP/",
    "method": "GET",
    "retryCount": 0,
    "errorMessages": null
  },
  "type": "Video",
  "shortCode": "BxNXsMxHPxP",
  "caption": "Marvel Studios’ #AvengersEndgame is shattering records across the globe. See it again in theaters: [link in bio]",
  "commentsCount": 1794,
  "dimensionsHeight": 750,
  "dimensionsWidth": 750,
  "displayUrl": "https://scontent-ort2-1.cdninstagram.com/vp/239e87b3b648f33169202e98a717e194/5CDE033C/t51.2885-15/e35/59449246_615674172234740_4080098836227673311_n.jpg?_nc_ht=scontent-ort2-1.cdninstagram.com",
  "likesCount": null,
  "videoDuration": 30.05,
  "videoViewCount": 1041624,
  "timestamp": "2019-05-08T16:51:42.000Z",
  "locationName": null,
  "ownerFullName": "Avengers: Endgame",
  "captionIsEdited": false,
  "hasRankedComments": false,
  "commentsDisabled": false,
  "displayResourceUrls": [
    "https://scontent-ort2-1.cdninstagram.com/vp/3cbe04cc1130a78ed12f2f4a63a7e5f0/5CDE6799/t51.2885-15/sh0.08/e35/s640x640/59449246_615674172234740_4080098836227673311_n.jpg?_nc_ht=scontent-ort2-1.cdninstagram.com",
    "https://scontent-ort2-1.cdninstagram.com/vp/239e87b3b648f33169202e98a717e194/5CDE033C/t51.2885-15/e35/59449246_615674172234740_4080098836227673311_n.jpg?_nc_ht=scontent-ort2-1.cdninstagram.com",
    "https://scontent-ort2-1.cdninstagram.com/vp/239e87b3b648f33169202e98a717e194/5CDE033C/t51.2885-15/e35/59449246_615674172234740_4080098836227673311_n.jpg?_nc_ht=scontent-ort2-1.cdninstagram.com"
  ],
  "locationSlug": null,
  "ownerUsername": "avengers",
  "isAdvertisement": false,
  "taggedUsers": [],
  "latestComments": [
    {
      "ownerUsername": "_.jaheen._",
      "text": "Who knew trailers can have the good stuff! 🙌🙌"
    },
    ...
  ]
}
```

## How to scrape Instagram
I wrote a short introduction to this solution and how it works. You can find it at [blog.apify.com](https://medium.com/p/21d05506aeb3)

## Instagram scraper - future
In the future, this solution will be extended with following features

- Scraping and download of Instagram photos
- Scraping of Instagram stories
