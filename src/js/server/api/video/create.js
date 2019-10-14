import path from 'path';
import multer from 'multer';
import config from 'react-global-configuration';
import {validateFiles} from '../../fileValidator';
import {formatFileSize} from '../../../shared/format';
import {generateGif, generatePoster, generateThumbnail, getVideoInfo, convertVideo} from '../../ffmpeg';
import {writeFile, unlink, rename, stat} from '../../fileOperations';

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

        const thumbnailDimensions = config.get('app.videoUpload.thumbnailDimensions');
        const uploadPath = config.get('app.videoUpload.path');
        const socket = req.app.locals.getSocket();
        const defaultStepData = {
            total: 3
        };

        socket.emit('upload.step', {
            ...defaultStepData,
            step: 1,
            status: 'Uploading'
        });

        await uploadAsync(req, res);
        socket.emit('upload.step', {
            ...defaultStepData,
            step: 2,
            status: 'Validating'
        });

        const files = Array.from(req.files);
        const errors = await validateFiles(files);
        const len = files.length;

        if (Array.isArray(errors)) {
            res.json({ errors });
            return;
        }

        socket.emit('upload.step', {
            ...defaultStepData,
            step: 3,
            status: 'Parsing'
        });

        const promises = files.map((file, index) => new Promise(async (resolve, reject) => {
            try {
                const defaultStepFileData = {
                    total: 7,
                    file,
                    index
                };
                const options = {};

                if (thumbnailDimensions) {
                    options.size = thumbnailDimensions;
                }

                socket.emit('upload.step.file', {
                    ...defaultStepFileData,
                    step: 1,
                    status: 'Converting',
                });


                const converted = await convertVideo(file.path, {
                    progress: progress => {
                        socket.emit('upload.step.file.progress', {
                            ...defaultStepFileData,
                            step: 1,
                            status: 'Converting',
                            percent: progress.percent
                        });
                    }
                });

                let c = `${uploadPath}/${converted}`;

                await unlink(file.path);
                await rename(c, file.path);

                c = file.path;

                socket.emit('upload.step.file', {
                    ...defaultStepFileData,
                    step: 2,
                    status: 'Generating Poster',
                });
                const poster = await generatePoster(c);

                socket.emit('upload.step.file', {
                    ...defaultStepFileData,
                    step: 3,
                    status: 'Generating Thumbnail',
                });
                const thumb = await generateThumbnail(c, options);

                socket.emit('upload.step.file', {
                    ...defaultStepFileData,
                    step: 4,
                    status: 'Generating Animated Thumbnail',
                });
                const animatedThumb = await generateGif(c, options);

                socket.emit('upload.step.file', {
                    ...defaultStepFileData,
                    step: 5,
                    status: 'Generating Metadata',
                });
                const info = await getVideoInfo(c);

                const stats = await stat(c);
                const size = stats['size'];

                const json = {
                    video: path.basename(c),
                    poster,
                    thumb,
                    animatedThumb,
                    metadata: info,
                    originalFileName: file.originalname,
                    type: file.mimetype,
                    size: size,
                    formattedSize: formatFileSize(size),
                };
                const jsonFile = file.path.replace(/\.[a-z0-9]{1,}$/i, '.json');

                socket.emit('upload.step.file', {
                    ...defaultStepFileData,
                    step: 6,
                    status: 'Saving',
                });
                await writeFile(jsonFile, JSON.stringify(json));

                socket.emit('upload.step.file', {
                    ...defaultStepFileData,
                    step: 7,
                    status: 'Done',
                });

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
