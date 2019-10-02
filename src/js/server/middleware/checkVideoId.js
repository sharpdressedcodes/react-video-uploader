import get from 'lodash/get';
import {readDir} from '../fileOperations';
import config from '../../config/main';

const uploadPath = get(config, 'app.videoUpload.path', 'dist/uploads');

export default async function checkVideoId(req, res, next) {

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
