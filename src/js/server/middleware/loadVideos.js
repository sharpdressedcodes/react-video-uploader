import { loadVideos } from '../api/video/read';

export default async function handleLoadVideos(req, res, next) {

    try {

        req.app.locals.data = req.app.locals.data || {};
        req.app.locals.data.videos = await loadVideos();
        next();

    } catch (err) {
        next(err);
    }
}
