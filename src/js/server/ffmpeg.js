import get from 'lodash/get';
import ffmpeg from 'fluent-ffmpeg';
import config from '../config/main';

const uploadPath = get(config, 'app.videoUpload.path', 'dist/uploads');

export function getVideoInfo(fileName) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(fileName, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

export function generatePoster(fileName, options) {
    return new Promise((resolve, reject) => {
        let result = null;

        function onComplete() {
            resolve(result[0]);
        }

        function onFilenames(fns) {
            result = fns;
        }

        const defaults = {
            folder: uploadPath,
            filename: '%b-%r-poster.png',
            count: 1,
            timemark: '1%',
            logger: console
            // size: ''
        };

        ffmpeg({
            source: fileName,
            logger: console
        })
            .on('filenames', onFilenames)
            .on('end', onComplete)
            .on('error', reject)
            .screenshot({ ...defaults, ...options });
    });
}

export function generateThumbnail(fileName, options) {
    return new Promise((resolve, reject) => {
        let result = null;

        function onComplete() {
            resolve(result[0]);
        }

        function onFilenames(fns) {
            result = fns;
        }

        const defaults = {
            folder: uploadPath,
            filename: '%b-%r-thumbnail.png',
            count: 1,
            timemark: '1%',
            logger: console,
            size: '320x180' // 16:9
        };

        ffmpeg({
            source: fileName,
            logger: console
        })
            .on('filenames', onFilenames)
            .on('end', onComplete)
            .on('error', reject)
            .screenshot({ ...defaults, ...options });
    });
}
