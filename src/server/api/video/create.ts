import path from 'node:path';
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
import {
    formatFileSize,
    isArrayEmpty,
    isObjectEmpty,
    parseFileName,
} from '../../../common';
import validateFormFile from '../../../common/validation/validateFormFile';
import { ConfigType } from '../../../config';
import { CreateStepType, ConvertFileStepType, ConvertProgressStepType } from '../../types';
import { LoadedVideoType } from '../../../state/types';
import validateFileSignature from '../../validation/validateFileSignature';
import componentConfig from '../../../components/pages/UploadPage/config';

type ExpressFile = Express.Multer.File;

const defaultStepData: Pick<CreateStepType, 'total'> = {
    total: 4,
};

type DefaultUploadFileStepType = Pick<ConvertFileStepType, 'total'> & {
    index?: ConvertFileStepType['index'];
    file?: ConvertFileStepType['file'];
};

const isProduction = process.env.NODE_ENV === 'production';

export const injectEmitMethods: RequestHandler = (req, res, next) => {
    const webSocket: WebSocket = req.app.locals.getWebSocket();
    const emit = (event: string, data: CreateStepType | ConvertFileStepType | ConvertProgressStepType) => {
        webSocket?.send(JSON.stringify({ event, data }));
    };
    const emitStep = (step: number, status: string) => {
        emit('create.step', {
            ...defaultStepData,
            step,
            status,
        });
    };
    const emitStepFile = (step: number, status: string, defaultData: any) => {
        emit('convert.step.file', {
            ...defaultData,
            step,
            status,
        });
    };
    const emitStepFileProgress = (percent: number, defaultData: any) => {
        emit('convert.step.file.progress', {
            ...defaultData,
            percent,
        });
    };

    req.app.locals.emit = emit;
    req.app.locals.emitStep = emitStep;
    req.app.locals.emitStepFile = emitStepFile;
    req.app.locals.emitStepFileProgress = emitStepFileProgress;

    next();
};

export const emitUploadStatusStep: RequestHandler = (req, res, next) => {
    const { emitStep } = req.app.locals;

    emitStep(1, 'Uploading');
    next();
};

const handleVideoCreate: RequestHandler = async (req, res, next) => {
    try {
        const config: ConfigType = req.app.locals.config;
        const { emitStep, emitStepFile, emitStepFileProgress } = req.app.locals;
        const thumbnailDimensions = config.videoUpload.thumbnailDimensions;
        const uploadPath = config.videoUpload.path;
        // This is the same as client side validation, apart from validateFileSignature
        const validateVideos = async (): Promise<Record<string, string[]>> => {
            const files = Array.from(req.files as ExpressFile[]);
            const errors: Record<string, string[]> = validateFormFile(files, componentConfig.videos.rules!);

            if (!isArrayEmpty(files)) {
                const results = await Promise.all(
                    files.map(file => validateFileSignature(file, componentConfig.videos.rules!.allowedFileTypes)),
                );

                results.forEach((result, index) => {
                    if (result) {
                        errors[index] = [result];
                    }
                });
            }

            return errors;
        };
        const validateForm = async () => ({
            videos: await validateVideos(),
        });

        // First step gets emitted before uploadParser middleware
        // emitStep(1, 'Uploading');

        emitStep(2, 'Validating');
        const files = Array.from(req.files as ExpressFile[]);
        const validationResult = await validateForm();
        const hasVideosErrors = !isObjectEmpty(validationResult.videos);

        if (hasVideosErrors) {
            // if (hasVideosErrors) {
            await Promise.all(files.map(file => unlink(file.path)));
            // }

            res.json({ errors: validationResult });
            return;
        }

        emitStep(3, 'Parsing');
        const result = await Promise.all(files.map((file, index) => new Promise((resolve, reject) => {
            (async () => {
                try {
                    const defaultStepFileData: DefaultUploadFileStepType = {
                        total: 6,
                        file,
                        index,
                    };
                    const options: Record<string, string> = { ...(thumbnailDimensions ? { size: thumbnailDimensions } : {}) };
                    const onProgress = (progress: FfProgressEventType) => {
                        emitStepFileProgress(progress.percent, defaultStepFileData);
                    };

                    emitStepFile(1, 'Converting video', defaultStepFileData);
                    const converted = await convertVideo(file.path, { onProgress });

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
        })));

        emitStep(4, 'Done');

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
