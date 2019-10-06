import config from 'react-global-configuration';
import {readDir} from '../fileOperations';

export default async function checkVideoId(req, res, next) {
    const uploadPath = config.get('app.videoUpload.path', 'dist/uploads');
    const id = req.params.id;

    if (id) {

        try {

            const files = await readDir(uploadPath);

            if (id < 0 || id > files.length - 1) {
                res.status(404).send('Not found');
            } else {
                next();
            }

        } catch (err) {
            next(err);
        }

    } else {
        next();
    }
}
