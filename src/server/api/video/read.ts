import { RequestHandler } from 'express';
import { readDirectory, readFile } from '../../utils/fileSystem';
import { findItemByUuid } from '../../../common';
import { LoadedVideoType } from '../../../state/types';

const read = (path: string) => readFile(path, 'utf8');

export const loadVideos = async (id: Nullable<string>, uploadPath: string) => {
    const items = (await readDirectory(uploadPath)).filter(item => item.endsWith('.json'));

    if (id === null) {
        const promises = items.map(item => read(`${uploadPath}/${item}`));

        return (await Promise.all(promises)).map(result => JSON.parse(result) as LoadedVideoType);
    }

    const item = findItemByUuid<string>(id, items);

    if (!item) {
        return null;
    }

    return JSON.parse((await read(`${uploadPath}/${item}`)).toString()) as LoadedVideoType;
};

const handleGetVideos: RequestHandler = async (req, res, next) => {
    const id = req.params.id || null;
    const key = `item${id === null ? 's' : ''}`;

    try {
        const uploadPath = req.app.locals.config.get('videoUpload.path', 'build/data/uploads');
        const result = await loadVideos(id, uploadPath);

        res.json({ [key]: result });
    } catch (err: unknown) {
        // console.error(err);
        res.json({ [key]: id === null ? [] : {}, error: (err as Error).message });
    }
};

export default handleGetVideos;
