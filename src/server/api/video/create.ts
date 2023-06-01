import path from 'node:path';
import multer from 'multer';
import { Express, RequestHandler } from 'express';
import { WebSocket } from 'ws';
import {
    generateGif,
    generatePosters,
    generateThumbnails,
    getVideoInfo,
    convertVideo,
    FfProgressEventType,
} from '../../utils/ffmpeg';
import { rename, stat, unlink, writeFile } from '../../utils/fileSystem';
import { createFileName, formatFileSize, isArrayEmpty, parseFileName } from '../../../common';
import { ConfigType } from '../../../config';
import serverFileValidation from '../../validation/serverFileValidation';
import { UploadStepType, UploadFileStepType, UploadProgressStepType } from '../../types';
import { LoadedVideoType } from '../../../state/types';
import { NormalisedFileType } from '../../../common/validation/fileValidation';

type ExpressFile = Express.Multer.File;

const defaultStepData: Pick<UploadStepType, 'total'> = {
    total: 4,
};

type DefaultUploadFileStepType = Pick<UploadFileStepType, 'total'> & {
    index?: UploadFileStepType['index'];
    file?: UploadFileStepType['file'];
};

const defaultStepFileData: DefaultUploadFileStepType = {
    total: 6,
};

const isProduction = process.env.NODE_ENV === 'production';

const handleVideoCreate: RequestHandler = async (req, res, next) => {
    try {
        // let currentStep = 1;
        // let currentFileStep = 1;
        // let currentProgressStep = 1;
        // const { config } = req.app.locals;
        const config: ConfigType = req.app.locals.config;
        const webSocket: WebSocket = req.app.locals.getWebSocket();
        // const defaultStepData = {
        //     total: 4,
        // };
        const emit = (event: string, data: UploadStepType | UploadFileStepType | UploadProgressStepType) => {
            webSocket?.send(JSON.stringify({ event, data }));
        };
        const emitStep = (step: number, status: string) => {
            emit('upload.step', {
                ...defaultStepData,
                step,
                status,
            });
        };
        const emitStepFile = (step: number, status: string, defaultData: any) => {
            emit('upload.step.file', {
                ...defaultData,
                step,
                status,
            });
        };
        const emitStepFileProgress = (step: number, status: string, percent: number, defaultData: any) => {
            emit('upload.step.file.progress', {
                ...defaultData,
                step,
                status,
                percent,
            });
        };
        const thumbnailDimensions = config.videoUpload.thumbnailDimensions;
        const uploadPath = config.videoUpload.path;
        const storage = multer.diskStorage({
            destination: (request, file, cb) => {
                cb(null, uploadPath);
            },
            filename: (request, file, cb) => {
                cb(null, createFileName(file));
            },
        });
        const uploadFiles = multer({ storage }).array('file');
        const uploadFilesAsync: RequestHandler = (request, response, next_) =>
            new Promise<Express.Request['files']>((resolve, reject) => {
                uploadFiles(request, response, err => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(request.files);
                });
            })
        ;

        emitStep(1, 'Uploading');
        await uploadFilesAsync(req, res, next);

        emitStep(2, 'Validating');
        const files = Array.from(req.files as ExpressFile[]);
        const validationResult = await serverFileValidation({
            files,
            allowedFileTypes: config.allowedFileTypes,
            allowedFileExtensions: config.allowedFileExtensions,
            maxFiles: config.videoUpload.maxFiles,
            maxFileSize: config.videoUpload.maxFileSize,
            maxTotalFileSize: config.videoUpload.maxTotalFileSize,
        });
        const { invalidFiles, validFiles } = validationResult;

        emitStep(3, 'Parsing');
        const promises = ((validFiles as ExpressFile[]) || []).map((file, index) => new Promise((resolve, reject) => {
            (async () => {
                try {
                    // const defaultStepFileData = {
                    //     total: 6,
                    //     file,
                    //     index,
                    // };
                    defaultStepFileData.file = file;
                    defaultStepFileData.index = index;

                    const options: Record<string, string> = { ...(thumbnailDimensions ? { size: thumbnailDimensions } : {}) };

                    emitStepFile(1, 'Converting', defaultStepFileData);
                    const converted = await convertVideo(file.path, {
                        onProgress: (progress: FfProgressEventType) => {
                            emitStepFileProgress(1, 'Converting', progress.percent, defaultStepFileData);
                        },
                    });

                    await unlink(file.path);
                    await rename(`${uploadPath}${path.sep}${converted}`, file.path);

                    emitStepFile(2, 'Generating Poster', defaultStepFileData);
                    const [poster] = await generatePosters(file.path);

                    emitStepFile(3, 'Generating Thumbnail', defaultStepFileData);
                    const [thumb] = await generateThumbnails(file.path, options);

                    emitStepFile(4, 'Generating Animated Thumbnail', defaultStepFileData);
                    const info = await getVideoInfo(file.path);
                    const animatedThumb = await generateGif(file.path, info, options);

                    emitStepFile(5, 'Generating Metadata', defaultStepFileData);
                    const stats = await stat(file.path);
                    const { size } = stats;
                    const fileName = path.basename(file.path);
                    const fileInfo = parseFileName(fileName);
                    const json: LoadedVideoType = {
                        video: fileName,
                        uuid: fileInfo?.uuid as string,
                        timestamp: fileInfo?.timestamp as string,
                        poster,
                        thumb,
                        animatedThumb,
                        metadata: info,
                        originalFileName: file.originalname,
                        type: file.mimetype,
                        size,
                        formattedSize: formatFileSize(size),
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

        if (invalidFiles && !isArrayEmpty(invalidFiles)) {
            await Promise.all(invalidFiles.map((file: NormalisedFileType) => unlink(file.path)));
            res.json({ validation: validationResult });
            return;
        }

        if (!isProduction) {
            // eslint-disable-next-line no-console
            console.log(`Received ${files.length} files`, files, result);
        }

        next();
    } catch (err) {
        next(err);
    }
};

export default handleVideoCreate;
