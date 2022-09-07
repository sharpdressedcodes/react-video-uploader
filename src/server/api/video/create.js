import path from 'node:path';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import { generateGif, generatePoster, generateThumbnail, getVideoInfo, convertVideo } from '../../ffmpeg';
import { rename, stat, unlink, writeFile } from '../../fileSystem';
import { formatFileSize, getFileName, isArrayEmpty } from '../../../common';
import enhancedFileValidation from '../../enhancedFileValidation';

export default async function handleVideoCreate(req, res, next) {
    try {
        const { config } = req.app.locals;
        const webSocket = req.app.locals.getWebSocket();
        const emit = (event, data) => {
            webSocket?.send(JSON.stringify({ event, data }));
        };
        const defaultStepData = {
            total: 4
        };
        const emitStep = (step, status) => {
            emit('upload.step', {
                ...defaultStepData,
                step,
                status
            });
        };
        const emitStepFile = (step, status, defaultStepFileData) => {
            emit('upload.step.file', {
                ...defaultStepFileData,
                step,
                status
            });
        };
        const emitStepFileProgress = (step, status, percent, defaultStepFileData) => {
            emit('upload.step.file.progress', {
                ...defaultStepFileData,
                step,
                status,
                percent
            });
        };
        const thumbnailDimensions = config.get('videoUpload.thumbnailDimensions');
        const uploadPath = config.get('videoUpload.path', 'build/data/uploads');
        const storage = multer.diskStorage({
            destination: (request, file, cb) => {
                cb(null, uploadPath);
            },
            filename: (request, file, cb) => {
                cb(null, `${+new Date()}-${uuid()}-${getFileName(file)}`);
            }
        });
        const uploadFiles = multer({ storage }).array('file');
        const uploadFilesAsync = (request, response) => new Promise((resolve, reject) => {
            uploadFiles(request, response, err => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(request.files);
            });
        });

        emitStep(1, 'Uploading');

        await uploadFilesAsync(req, res);

        emitStep(2, 'Validating');

        const files = Array.from(req.files);
        const validationResult = await enhancedFileValidation({
            files,
            fileSignatures: config.get('server.fileSignatures', {}),
            allowedFileTypes: config.get('videoUpload.allowedFileTypes', []),
            maxFiles: config.get('videoUpload.maxFiles', 0),
            maxFileSize: config.get('videoUpload.maxFileSize', 0),
            maxTotalFileSize: config.get('videoUpload.maxTotalFileSize', 0)
        });
        const { invalidFiles, validFiles } = validationResult;

        emitStep(3, 'Parsing');

        const promises = validFiles.map((file, index) => new Promise((resolve, reject) => {
            (async () => {
                try {
                    const defaultStepFileData = {
                        total: 6,
                        file,
                        index
                    };
                    const options = {};

                    if (thumbnailDimensions) {
                        options.size = thumbnailDimensions;
                    }

                    emitStepFile(1, 'Converting', defaultStepFileData);

                    const converted = await convertVideo(file.path, {
                        progress: progress => {
                            emitStepFileProgress(1, 'Converting', progress.percent, defaultStepFileData);
                        }
                    });

                    await unlink(file.path);
                    await rename(`${uploadPath}${path.sep}${converted}`, file.path);

                    emitStepFile(2, 'Generating Poster', defaultStepFileData);
                    const poster = await generatePoster(file.path);

                    emitStepFile(3, 'Generating Thumbnail', defaultStepFileData);
                    const thumb = await generateThumbnail(file.path, options);

                    emitStepFile(4, 'Generating Animated Thumbnail', defaultStepFileData);
                    const info = await getVideoInfo(file.path);
                    const animatedThumb = await generateGif(file.path, options, info);

                    emitStepFile(5, 'Generating Metadata', defaultStepFileData);
                    const stats = await stat(file.path);
                    const { size } = stats;
                    const json = {
                        video: path.basename(file.path),
                        poster,
                        thumb,
                        animatedThumb,
                        metadata: info,
                        originalFileName: file.originalname,
                        type: file.mimetype,
                        size,
                        formattedSize: formatFileSize(size)
                    };
                    const fileExtension = path.extname(file.path);
                    const jsonFile = `${file.path.substring(0, file.path.length - fileExtension.length)}.json`;

                    await writeFile(jsonFile, JSON.stringify(json));

                    emitStepFile(6, 'Done', defaultStepFileData);

                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            })();
        }));
        const result = await Promise.all(promises);

        emitStep(4, 'Done');

        if (!isArrayEmpty(invalidFiles)) {
            await Promise.all(invalidFiles.map(file => unlink(file.path)));
            res.json({ validation: validationResult });
            return;
        }

        // eslint-disable-next-line no-console
        console.log(`Received ${files.length} files`, files, result);
        next();
    } catch (err) {
        next(err);
    }
}
