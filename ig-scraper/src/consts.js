module.exports = {
    // Types of pages which this actor is able to process
    PAGE_TYPES: {
        PLACE: 'location',
        PROFILE: 'user',
        HASHTAG: 'hashtag',
        POST: 'post',
    },
    // Types of scrapes this actor can do
    SCRAPE_TYPES: {
        POSTS: 'posts',
        COMMENTS: 'comments',
        DETAILS: 'details',
    },
    // Types of search queries available in instagram search
    SEARCH_TYPES: {
        PLACE: 'place',
        USER: 'user',
        HASHTAG: 'hashtag',
    },
    // Instagrams GraphQL Endpoint URL
    GRAPHQL_ENDPOINT: 'https://www.instagram.com/graphql/query/?query_hash=',
    // selector for the load more button
    LOAD_MORE_BUTTON: 'span[aria-label="Load more comments"]',
    // Resource types blocked from loading to speed up the solution
    ABORTED_RESOUCE_TYPES: [
        // 'stylesheet',
        'image',
        // 'media',
        'font',
        'texttrack',
        'fetch',
        'eventsource',
        'websocket',
        'manifest',
        'other'
    ],
};