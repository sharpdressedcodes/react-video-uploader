const handleVideoCreate = require('./create');
const read = require('./read');

module.exports = {
    handleVideoCreate,
    loadVideos: read.loadVideos,
    handleGetVideos: read.default,
};
