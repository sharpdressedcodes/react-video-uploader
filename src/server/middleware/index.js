const checkVideoId = require('./checkVideoId');
const fakeFavIcon = require('./fakeFavIcon');
const injectCsrf = require('./injectCsrf');
const loadConfig = require('./loadConfig');
const loadVideos = require('./loadVideos');
const loadWebSocket = require('./loadWebSocket');
const logErrors = require('./logErrors');
const render = require('./render');
const securityHeaders = require('./securityHeaders');
const trapErrors = require('./trapErrors');

module.exports = {
    checkVideoId,
    fakeFavIcon,
    injectCsrf,
    loadConfig,
    loadVideos,
    loadWebSocket,
    logErrors,
    render,
    securityHeaders,
    trapErrors,
};
