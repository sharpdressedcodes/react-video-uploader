import path from 'path';
import multer from 'multer';
import config from 'react-global-configuration';
import {validateFiles} from '../../fileValidator';
import {formatFileSize} from '../../../shared/format';
import {generatePoster, generateThumbnail, getVideoInfo} from '../../ffmpeg';
import {writeFile} from '../../fileOperations';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.get('app.videoUpload.path', 'dist/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, config.get('app.videoUpload.filenameGenerator', str => str)(file.originalname));
    },
});
const upload = multer({ storage }).array('file');
const uploadAsync = (req, res) => new Promise((resolve, reject) => {
    upload(req, res, err => {
        if (typeof err !== 'undefined') {
            reject(err);
        } else {
            resolve(req.files);
        }
    });
});

export default async function handleVideoCreate(req, res, next) {

    try {

        await uploadAsync(req, res);

        const files = Array.from(req.files);
        const errors = await validateFiles(files);
        const len = files.length;

        if (Array.isArray(errors)) {
            res.json({ errors });
            return;
        }

        const promises = files.map(file => new Promise(async (resolve, reject) => {
            try {
                const poster = await generatePoster(file.path);
                const thumb = await generateThumbnail(file.path);
                const info = await getVideoInfo(file.path);
                const json = {
                    video: path.basename(file.path),
                    poster,
                    thumb,
                    metadata: info,
                    originalFileName: file.originalname,
                    type: file.mimetype,
                    size: file.size,
                    formattedSize: formatFileSize(file.size),
                };
                const jsonFile = file.path.replace(/\.[a-z0-9]{1,}$/i, '.json');

                await writeFile(jsonFile, JSON.stringify(json));

                resolve(true);
            } catch (err) {
                reject(err);
            }
        }));

        const result = await Promise.all(promises);
        console.log(`Received ${len} files`, files, result);
        next();

    } catch (err) {
        next(err);
    }

}
