const { loadVideos: load } = require('../api/video/read');

const loadVideos = async (req, res, next) => {
    try {
        req.app.locals.data = req.app.locals.data || {};
        req.app.locals.data.videos = await load(null, req.app.locals.config.get('videoUpload.path', 'build/data/uploads'));

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = loadVideos;
