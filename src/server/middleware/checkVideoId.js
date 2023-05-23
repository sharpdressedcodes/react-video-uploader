const { readDirectory } = require('../fileSystem');
const { findItemByUuid } = require('../../common/index.cjs');

const checkVideoId = async (req, res, next) => {
    const uploadPath = req.app.locals.config.get('videoUpload.path', 'build/data/uploads');
    const id = req.params.id;

    if (id !== null) {
        try {
            const files = await readDirectory(uploadPath);

            if (!findItemByUuid(id, files)) {
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

module.exports = checkVideoId;
