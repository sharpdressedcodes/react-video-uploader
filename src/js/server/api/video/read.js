import get from 'lodash/get';
import {directoryExists, readDir, readFile} from '../../fileOperations';
import config from '../../../config/main';

const uploadPath = get(config, 'app.videoUpload.path', 'dist/uploads');

export default async function handleGetVideos(req, res, next) {

    console.log('handleGetVideos::start');

    const pathExists = await directoryExists(uploadPath);

    if (pathExists) {
        try {
            const files = await readDir(uploadPath);
            const items = files.filter(item => item.endsWith('.json'));
            const len = items.length;
            const id = req.params.id;

            if (!id) {
                const promises = items
                    .map(item => new Promise((resolve, reject) => {
                        readFile(`${uploadPath}/${item}`)
                            .then(result => resolve(JSON.parse(result)))
                            .catch(reject);
                    }));

                res.json({ items: await Promise.all(promises) });
            } else {
                if (id < 0 || id > len - 1) {
                    res.status(404).send('Not found');

                    return;
                }

                const item = JSON.parse(await readFile(`${uploadPath}/${items[id]}`, 'utf8'));

                res.json({ item });
            }
        } catch (err) {
            //console.log(err);
            console.log('handleGetVideos::error', err.message);
            res.json({ items: [], error: err.message });
        }
    } else {
        res.status(404).send('Not found');
    }

    console.log('handleGetVideos::end\n\n');

}

