const { readDirectory, readFile } = require('../../fileSystem');
const { findItemByUuid } = require('../../../common/index.cjs');

const read = path => readFile(path, 'utf8');

const loadVideos = async (id, uploadPath) => {
    const items = (await readDirectory(uploadPath)).filter(item => item.endsWith('.json'));

    if (id === null) {
        const promises = items.map(item => read(`${uploadPath}/${item}`));

        return (await Promise.all(promises)).map(result => JSON.parse(result));
    }

    const item = findItemByUuid/*<string>*/(id, items);

    if (!item) {
        return null;
    }

    return JSON.parse((await read(`${uploadPath}/${item}`)).toString());
};

const handleGetVideos = async (req, res) => {
    const id = req.params.id || null;
    const key = `item${id === null ? 's' : ''}`;

    try {
        const uploadPath = req.app.locals.config.get('videoUpload.path', 'build/data/uploads');
        const result = await loadVideos(id, uploadPath);

        res.json({ [key]: result });
    } catch (err) {
        // console.error(err);
        res.json({ [key]: id === null ? [] : {}, error: err.message });
    }
};

module.exports = {
    'default': handleGetVideos,
    loadVideos,
};
