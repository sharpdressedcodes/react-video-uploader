import { readDirectory, readFile } from '../../fileSystem';

const read = path => readFile(path, 'utf8');

export function loadVideos(id, uploadPath) {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                const items = (await readDirectory(uploadPath)).filter(item => item.endsWith('.json'));

                if (id === null) {
                    const promises = items.map(item => read(`${uploadPath}/${item}`));

                    resolve((await Promise.all(promises)).map(result => JSON.parse(result)));
                    return;
                }

                resolve(JSON.parse(await read(`${uploadPath}/${items[id]}`)));
            } catch (err) {
                reject(err);
            }
        })();
    });
}

export default async function handleGetVideos(req, res, next) {
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
}
