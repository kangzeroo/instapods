const Apify = require('apify');
const { getCheckedVariable, log } = require('./helpers');
const { PAGE_TYPES, GRAPHQL_ENDPOINT, LOAD_MORE_BUTTON } = require('./consts');
const errors = require('./errors');

const initData = {};
const comments = {};

/**
 * Takes type of page and data loaded through GraphQL and outputs
 * correct list of comments.
 * @param {Object} data GraphQL data
 */
const getCommentsFromGraphQL = (data) => {
    const timeline = data.shortcode_media.edge_media_to_parent_comment;
    const comments = timeline ? timeline.edges.reverse() : [];
    const hasNextPage = timeline ? timeline.page_info.has_next_page : false;
    return { comments, hasNextPage };
}

/**
 * Clicks on "Load more comments" button and waits till GraphQL response is received
 * @param {Object} pageData Parsed page data
 * @param {Object} page Puppeteers page object
 * @param {Integer} retry Retry attempts counter
 */
const loadMore = async (pageData, page, retry = 0) => {
    await page.keyboard.press('PageUp');
    const checkedVariable = getCheckedVariable(pageData.pageType);
    const responsePromise = page.waitForResponse(
        (response) => {
            const responseUrl = response.url();
            return responseUrl.startsWith(GRAPHQL_ENDPOINT) 
                && responseUrl.includes(checkedVariable)
        },
        { timeout: 20000 }
    );

    let clicked;
    for (let i = 0; i < 30; i++) {
        clicked = await Promise.all([
            page.click(LOAD_MORE_BUTTON),
            page.waitForRequest(
                (request) => {
                    const requestUrl = request.url();
                    return requestUrl.startsWith(GRAPHQL_ENDPOINT) 
                        && requestUrl.includes(checkedVariable) 
                        && requestUrl.includes('%22first%22')
                }, 
                {
                    timeout: 2000,
                }
            ).catch(() => null),
        ]);
        if (clicked[1]) break;
    }

    let data = null;
    if (clicked[1]){
        try {
            const response = await responsePromise;
            const json = await response.json();
            if (json) data = json['data'];
        } catch (error) {
            Apify.utils.log.error(error);
        }
    }

    if (!data && retry < 10 && (scrolled[1] || retry < 5)) {
        let retryDelay = retry ? ++retry * retry * 1000 : ++retry * 1000;
        log(pageData, `Retry scroll after ${retryDelay / 1000} seconds`);
        await page.waitFor(retryDelay);
        return loadMore(pageData, page, retry);
    }

    await page.waitFor(500);
    return data;
};

/**
 * Loads data and clicks on "Load more comments" until the limit is reached or the page has no more comments
 * @param {Object} pageData 
 * @param {Object} page 
 * @param {Object} request 
 * @param {Number} length 
 */
const finiteScroll = async (pageData, page, request, length = 0) => {
    const data = await loadMore(pageData, page);
    if (data) {
        const timeline = getCommentsFromGraphQL(data);
        if (!timeline.hasNextPage) return;
    }

    try {
        await page.waitForSelector(LOAD_MORE_BUTTON)
        if (comments[pageData.id].length < request.userData.limit) {
            await finiteScroll(pageData, page, request, comments[pageData.id].length)
        }
    } catch (err) {
        console.log(err)
    } 
};

/**
 * Loads data from entry date and then loads comments untill limit is reached
 * @param {Object} page Puppeteer Page object
 * @param {Object} request Apify Request object
 * @param {Object} itemSpec Parsed page data
 * @param {Object} entryData data from window._shared_data.entry_data
 */
const scrapeComments = async (page, request, itemSpec, entryData) => {
    // Check that current page is of a type which has comments
    if (itemSpec.pageType !== PAGE_TYPES.POST) throw errors.notPostPage();

    const timeline = getCommentsFromGraphQL(entryData.PostPage[0].graphql);
    initData[itemSpec.id] = timeline;

    if (initData[itemSpec.id]) {
        comments[itemSpec.id] = timeline.comments;
        log(page.itemSpec, `${timeline.comments.length} items added, ${comments[page.itemSpec.id].length} items total`);
    } else {
        log(itemSpec, 'Waiting for initial data to load');
        while (!initData[itemSpec.id]) await page.waitFor(100);
    }

    await page.waitFor(500);

    if (initData[itemSpec.id].hasNextPage && comments[itemSpec.id].length < request.userData.limit) {
        await page.waitFor(1000);
        await finiteScroll(itemSpec, page, request);
    }

    const output = comments[itemSpec.id].map((item, index) => ({
        '#debug': {
            index,
            ...Apify.utils.createRequestDebugInfo(request),
            ...itemSpec,
        },
        id: item.node.id,
        text: item.node.text,
        timestamp: new Date(parseInt(item.node.createdAt) * 1000),
        ownerId: item.node.owner ? item.node.owner.id : null, 
        ownerIsVerified: item.node.owner ? item.node.owner.is_verified : null, 
        ownerUsername: item.node.owner ? item.node.owner.username : null, 
        ownerProfilePicUrl: item.node.owner ? item.node.owner.profile_pic_url : null, 
    })).slice(0, request.userData.limit);

    await Apify.pushData(output);
    log(itemSpec, `${output.length} items saved, task finished`);
}

/**
 * Takes GraphQL response, checks that it's a response with more comments and then parses the comments from it
 * @param {Object} page Puppeteer Page object
 * @param {Object} response Puppeteer Response object
 */
async function handleCommentsGraphQLResponse(page, response) {
    const responseUrl = response.url();

    // Get variable we look for in the query string of request
    const checkedVariable = getCheckedVariable(page.itemSpec.pageType);

    // Skip queries for other stuff then posts
    if (!responseUrl.includes(checkedVariable) || !responseUrl.includes('%22first%22')) return;

    const data = await response.json();
    const timeline = getCommentsFromGraphQL(data['data']);
    
    comments[page.itemSpec.id] = comments[page.itemSpec.id].concat(timeline.comments);

    if (!initData[page.itemSpec.id]) initData[page.itemSpec.id] = timeline;
    else if (initData[page.itemSpec.id].hasNextPage && !timeline.hasNextPage) {
        initData[page.itemSpec.id].hasNextPage = false;
    }

    log(page.itemSpec, `${timeline.comments.length} items added, ${comments[page.itemSpec.id].length} items total`);
}


module.exports = {
    scrapeComments,
    handleCommentsGraphQLResponse,
};