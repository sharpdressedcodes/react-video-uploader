import get from 'lodash/get';
import { readDir, readFile } from '../../fileOperations';
import config from '../../../config/main';

const uploadPath = get(config, 'app.videoUpload.path', 'dist/uploads');

export function loadVideos(id = null) {
    return new Promise((resolve, reject) => {

        readDir(uploadPath)
            .then(files => {
                const items = files.filter(item => item.endsWith('.json'));

                if (!id) {
                    const promises = items
                        .map(item => new Promise((resolve, reject) => {
                            readFile(`${uploadPath}/${item}`)
                                .then(result => resolve(JSON.parse(result)))
                                .catch(reject);
                        }));

                    resolve(Promise.all(promises));

                } else {

                    readFile(`${uploadPath}/${items[id]}`, 'utf8')
                        .then(item => resolve(JSON.parse(item)))
                        .catch(reject);

                }
            })
            .catch(reject);

    });
}

export default async function handleGetVideos(req, res, next) {

    try {

        const id = req.params.id || null;
        const result = await loadVideos(id);

        if (!id) {
            res.json({ items: result });
        } else {
            res.json({ item: result });
        }

    } catch (err) {
        console.log(err);
        res.json({ items: [], error: err.message });
    }

    // try {
    //
    //     const files = await readDir(uploadPath);
    //     const items = files.filter(item => item.endsWith('.json'));
    //     const len = items.length;
    //     const id = req.params.id;
    //
    //     if (!id) {
    //         const promises = items
    //             .map(item => new Promise((resolve, reject) => {
    //                 readFile(`${uploadPath}/${item}`)
    //                     .then(result => resolve(JSON.parse(result)))
    //                     .catch(reject);
    //             }));
    //
    //         res.json({ items: await Promise.all(promises) });
    //     } else {
    //         if (id < 0 || id > len - 1) {
    //             res.status(404).send('Not found');
    //             return;
    //         }
    //
    //         const item = JSON.parse(await readFile(`${uploadPath}/${items[id]}`, 'utf8'));
    //
    //         res.json({ item });
    //     }
    // } catch (err) {
    //     console.log(err);
    //     res.json({ items: [], error: err.message });
    // }

}

