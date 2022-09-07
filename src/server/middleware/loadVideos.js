import { loadVideos as load } from '../api/video/read';

export default async function loadVideos(req, res, next) {
    try {
        req.app.locals.data = req.app.locals.data || {};
        req.app.locals.data.videos = await load(null, req.app.locals.config.get('videoUpload.path', 'build/data/uploads'));
        next();
    } catch (err) {
        next(err);
    }
}
