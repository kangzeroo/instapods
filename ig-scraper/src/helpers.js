const Apify = require('apify');
const errors = require('./errors');
const consts = require('./consts');

const { PAGE_TYPES } = consts;

/**
 * Takes object from _sharedData.entry_data and parses it into simpler object
 * @param {Object} entryData 
 */
const getItemSpec = (entryData) => {
    if (entryData.LocationsPage) {
        const itemData = entryData.LocationsPage[0].graphql.location;
        return {
            pageType: PAGE_TYPES.PLACE,
            id: itemData.slug,
            locationId: itemData.id,
            locationSlug: itemData.slug,
            locationName: itemData.name,
        };
    }

    if (entryData.TagPage) {
        const itemData = entryData.TagPage[0].graphql.hashtag;
        return {
            pageType: PAGE_TYPES.HASHTAG,
            id: itemData.name,
            tagId: itemData.id,
            tagName: itemData.name,
        };
    }

    if (entryData.ProfilePage) {
        const itemData = entryData.ProfilePage[0].graphql.user;
        return {
            pageType: PAGE_TYPES.PROFILE,
            id: itemData.username,
            userId: itemData.id,
            userUsername: itemData.username,
            userFullName: itemData.full_name,
        };
    }

    if (entryData.PostPage) {
        const itemData = entryData.PostPage[0].graphql.shortcode_media;
        return {
            pageType: PAGE_TYPES.POST,
            id: itemData.shortcode,
            postCommentsDisabled: itemData.comments_disabled,
            postIsVideo: itemData.is_video,
            postVideoViewCount: itemData.video_view_count || 0,
            postVideoDurationSecs: itemData.video_duration || 0,
        };
    }

    throw errors.unsupportedPage();
};

/**
 * Takes page data containing type of page and outputs short label for log line
 * @param {Object} pageData Object representing currently loaded IG page
 */
const getLogLabel = (pageData) => {
    switch (pageData.pageType) {
        case PAGE_TYPES.PLACE: return `Place "${pageData.locationName}"`;
        case PAGE_TYPES.PROFILE: return `User "${pageData.userUsername}"`;
        case PAGE_TYPES.HASHTAG: return `Tag "${pageData.tagName}"`;
        case PAGE_TYPES.POST: return `Post "${pageData.id}"`;
    }
}

/**
 * Takes page type and outputs variable that must be present in graphql query
 * @param {String} pageType 
 */
const getCheckedVariable = (pageType) => {
    switch (pageType) {
        case PAGE_TYPES.PLACE: return `%22id%22`;
        case PAGE_TYPES.PROFILE: return '%22id%22';
        case PAGE_TYPES.HASHTAG: return '%22tag_name%22';
        case PAGE_TYPES.POST: return '%22shortcode%22';
    }
}

/**
 * Based on parsed data from current page saves a message into log with prefix identifying current page
 * @param {Object} pageData Parsed page data
 * @param {String} message Message to be outputed
 */
const log = (pageData, message) => {
    const label = getLogLabel(pageData);
    return Apify.utils.log.info(`${label}: ${message}`);
};

module.exports = {
    getItemSpec,
    getCheckedVariable,
    log,
};