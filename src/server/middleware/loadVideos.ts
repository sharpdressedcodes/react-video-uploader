import { RequestHandler } from 'express';
import { loadVideos as load } from '../api/video/read';

const loadVideos: RequestHandler = async (req, res, next) => {
    try {
        req.app.locals.data = req.app.locals.data || {};
        req.app.locals.data.videos = await load(null, req.app.locals.config.videoUpload.path);

        next();
    } catch (err) {
        next(err);
    }
};

export default loadVideos;
