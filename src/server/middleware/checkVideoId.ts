import { RequestHandler } from 'express';
import { readDirectory } from '../utils/fileSystem';
import { findItemByUuid } from '../../common';

const checkVideoId: RequestHandler = async (req, res, next) => {
    const uploadPath = req.app.locals.config.videoUpload.path;
    const id = req.params.id;

    if (id !== null) {
        try {
            const files = await readDirectory(uploadPath);

            if (!findItemByUuid<string>(id, files)) {
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
};

export default checkVideoId;
