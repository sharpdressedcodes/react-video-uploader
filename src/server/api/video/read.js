const { readDirectory, readFile } = require('../../fileSystem');

const read = path => readFile(path, 'utf8');

const loadVideos = async (id, uploadPath) => {
    // try {
    const items = (await readDirectory(uploadPath)).filter(item => item.endsWith('.json'));

    if (id === null) {
        const promises = items.map(item => read(`${uploadPath}/${item}`));

        return (await Promise.all(promises)).map(result => JSON.parse(result));
        // return;
    }

    return JSON.parse(await read(`${uploadPath}/${items[id]}`));
    // } catch (err) {
    //     reject(err);
    // }
};

const handleGetVideos = async (req, res) => {
    try {
        const id = req.params.id || null;
        const uploadPath = req.app.locals.config.get('videoUpload.path', 'build/data/uploads');
        const result = await loadVideos(id, uploadPath);
        const key = `item${id === null ? 's' : ''}`;

        res.json({ [key]: result });
    } catch (err) {
        // console.error(err);
        res.json({ items: [], error: err.message });
    }
};

module.exports = {
    'default': handleGetVideos,
    loadVideos,
};
