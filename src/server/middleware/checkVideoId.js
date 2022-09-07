import { readDirectory } from '../fileSystem';

const checkVideoId = async (req, res, next) => {
    const uploadPath = req.app.locals.config.get('videoUpload.path', 'build/data/uploads');
    const id = req.params.id;

    if (id !== null) {
        try {
            const files = await readDirectory(uploadPath);

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
};

export default checkVideoId;
