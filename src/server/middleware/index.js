const checkVideoId = require('./checkVideoId');
const fakeFavIcon = require('./fakeFavIcon');
const injectCsrf = require('./injectCsrf');
const loadConfig = require('./loadConfig');
const loadVideos = require('./loadVideos');
const loadWebSocket = require('./loadWebSocket');
const logErrors = require('./logErrors');
const trapErrors = require('./trapErrors');
const render = require('./render');

module.exports = {
    checkVideoId,
    fakeFavIcon,
    injectCsrf,
    loadConfig,
    loadVideos,
    loadWebSocket,
    logErrors,
    trapErrors,
    render,
};
