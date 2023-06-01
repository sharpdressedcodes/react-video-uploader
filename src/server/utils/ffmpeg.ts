import path from 'node:path';
import ffmpeg, { FfmpegCommandOptions } from 'fluent-ffmpeg';
import { CustomFfprobeData } from '../../state/types';

export type FfProgressEventType = {
    percent: number;
};

export type GeneratePostersOptionsType = {
    filename: string;
    folder: string;
    count: number;
    timemark: number | string;
    logger: FfmpegCommandOptions['logger'],
};

export type GenerateThumbnailsOptionsType = GeneratePostersOptionsType & {
    size: string;
};

export type GenerateGifOptionsType = Omit<GenerateThumbnailsOptionsType, 'count' | 'folder'> & {
    onProgress: (progress: FfProgressEventType) => void;
    fps: number;
    multiplier: number;
    duration: number;
};

export type ConvertVideoOptionsType = Pick<GenerateGifOptionsType, 'filename' | 'logger' | 'onProgress'> & {
    format: string;
    audioCodec: string;
    videoCodec: string;
};

export const defaultGeneratePostersOptions: Partial<GeneratePostersOptionsType> = {
    // folder: path.dirname(fileName),
    filename: '%b-%r-poster.png',
    count: 1,
    timemark: '1%',
    logger: console,
};

export const defaultGenerateThumbnailsOptions: Partial<GenerateThumbnailsOptionsType> = {
    filename: '%b-%r-thumbnail.png',
    count: 1,
    timemark: '1%',
    logger: console,
    size: '320x180', // 16:9
};

export const defaultGenerateGifOptions: GenerateGifOptionsType = {
    filename: '%b-%r-thumbnail.gif',
    onProgress: (progress: FfProgressEventType) => progress.percent,
    fps: 10,
    multiplier: 1,
    duration: 2.5,
    timemark: 5.0,
    logger: console,
    size: '320x180', // 16:9
};

export const defaultConvertVideoOptions: ConvertVideoOptionsType = {
    filename: '%b-converted.%f',
    onProgress: (progress: FfProgressEventType) => progress.percent,
    logger: console,
    audioCodec: 'libmp3lame',
    videoCodec: 'libx264',
    format: 'mp4',
};

export const getVideoInfo = (fileName: string) => new Promise<CustomFfprobeData>((resolve, reject) => {
    ffmpeg.ffprobe(fileName, (err, data: CustomFfprobeData) => {
        if (err) {
            reject(err);
            return;
        }

        resolve(data);
    });
});

export const generatePosters = (
    fileName: string,
    options: Partial<GeneratePostersOptionsType> = {},
) => new Promise<string[]>((resolve, reject) => {
    let result: string[];

    const onComplete = () => {
        resolve(result);
    };
    const onFilenames = (fns: string[]) => {
        result = fns;
    };
    const merged = {
        ...defaultGeneratePostersOptions,
        folder: path.dirname(fileName),
        ...options,
    };

    ffmpeg({ source: fileName, logger: merged.logger })
        .on('filenames', onFilenames)
        .on('end', onComplete)
        .on('error', reject)
        .screenshot(merged)
    ;
});

export const generateThumbnails = (
    fileName: string,
    options: Partial<GenerateThumbnailsOptionsType> = {},
) => new Promise<string[]>((resolve, reject) => {
    let result: string[];

    const onComplete = () => {
        resolve(result);
    };
    const onFilenames = (fns: string[]) => {
        result = fns;
    };
    const merged = {
        ...defaultGenerateThumbnailsOptions,
        folder: path.dirname(fileName),
        ...options,
    };

    ffmpeg({ source: fileName, logger: merged.logger })
        .on('filenames', onFilenames)
        .on('end', onComplete)
        .on('error', reject)
        .screenshot(merged)
    ;
});

export const generateGif = (
    fileName: string,
    info: CustomFfprobeData,
    options: Partial<GenerateGifOptionsType> = {},
) => new Promise<string>((resolve, reject) => {
    // Examples (using command line):
    // ffmpeg -ss 61.0 -t 2.5 -i test.mp4 -filter_complex "[0:v] fps=12,scale=320:-1,split [a][b];[a] palettegen [p];[b][p] paletteuse" test.gif
    // ffmpeg -ss 1.0 -t 2.5 -i test.mp4 -filter_complex "[0:v] fps=12,scale=320:180,split [a][b];[a] palettegen [p];[b][p] paletteuse" test.gif
    let outputFileName = '';

    const ext = path.extname(fileName);
    const onComplete = () => {
        resolve(path.basename(outputFileName));
    };
    const merged = {
        ...defaultGenerateGifOptions,
        ...options,
    };
    let timemark = merged.timemark;
    let duration = merged.duration;

    // Convert timemark from percentage to number
    if (typeof timemark === 'string' && info.format.duration) {
        const percentage = parseInt(timemark.replace('%', ''), 10);

        timemark = duration * (percentage / 100);
    }

    // Make sure the time mark + duration of the gif doesn't go over the actual video duration
    if (typeof timemark === 'number' && info.format.duration && info.format.duration < timemark + duration) {
        // First try setting the start to 0
        timemark = 0;

        // Also ensure duration doesn't go longer than actual video duration
        if (info.format.duration < duration) {
            duration = info.format.duration;
        }
    }

    merged.timemark = timemark;
    merged.duration = duration;

    const multiplier = merged.multiplier === 1 ? '' : `,setpts=(1/${merged.multiplier.toString()})*PTS`;
    const scale = merged.size.replace('x', ':');
    const inputOptions = [
        `-ss ${merged.timemark}`,
        `-t ${merged.duration}`,
    ];

    outputFileName = merged.filename
        .replace('%b', fileName.substring(0, fileName.length - ext.length))
        .replace('%r', merged.size.replace('?', ''))
    ;

    ffmpeg({ source: fileName, logger: merged.logger })
        .on('progress', merged.onProgress as (...args: any[]) => void)
        .on('end', onComplete)
        .on('error', reject)
        .inputOptions(inputOptions)
        .addOutputOption('-filter_complex', `[0:v] fps=${merged.fps}${multiplier},scale=${scale},split [a][b];[a] palettegen [p];[b][p] paletteuse`)
        .output(outputFileName)
        .run()
    ;
});

export const convertVideo = (
    fileName: string,
    options: Partial<ConvertVideoOptionsType> = {},
) => new Promise((resolve, reject) => {
    let outputFileName = '';

    const ext = path.extname(fileName);
    const onComplete = () => {
        resolve(path.basename(outputFileName));
    };
    const merged = {
        ...defaultConvertVideoOptions,
        ...options,
    };

    outputFileName = merged.filename
        .replace('%b', fileName.substring(0, fileName.length - ext.length))
        .replace('%f', merged.format)
    ;

    ffmpeg({ source: fileName, logger: merged.logger })
        .on('end', onComplete)
        .on('error', reject)
        .on('progress', merged.onProgress)
        .audioCodec(merged.audioCodec)
        .videoCodec(merged.videoCodec)
        .addOutputOption('-preset', 'faster')
        // .addOutputOption('-c:a', 'copy')
        .format(merged.format)
        .save(outputFileName)
    ;
});
