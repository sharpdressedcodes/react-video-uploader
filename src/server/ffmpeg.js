import path from 'node:path';
import ffmpeg from 'fluent-ffmpeg';

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

export function generatePoster(fileName, options = {}) {
    return new Promise((resolve, reject) => {
        let result = null;

        function onComplete() {
            resolve(result[0]);
        }

        function onFilenames(fns) {
            result = fns;
        }

        const defaults = {
            folder: path.dirname(fileName),
            filename: '%b-%r-poster.png',
            count: 1,
            timemark: '1%',
            logger: console
            // size: ''
        };

        const merged = {
            ...defaults,
            ...options
        };

        ffmpeg({
            source: fileName,
            logger: merged.logger
        })
            .on('filenames', onFilenames)
            .on('end', onComplete)
            .on('error', reject)
            .screenshot(merged);
    });
}

export function generateThumbnail(fileName, options = {}) {
    return new Promise((resolve, reject) => {
        let result = null;

        function onComplete() {
            resolve(result[0]);
        }

        function onFilenames(fns) {
            result = fns;
        }

        const defaults = {
            folder: path.dirname(fileName),
            filename: '%b-%r-thumbnail.png',
            count: 1,
            timemark: '1%',
            logger: console,
            size: '320x180' // 16:9
        };

        const merged = {
            ...defaults,
            ...options
        };

        ffmpeg({
            source: fileName,
            logger: merged.logger
        })
            .on('filenames', onFilenames)
            .on('end', onComplete)
            .on('error', reject)
            .screenshot(merged);
    });
}

export function generateGif(fileName, options = {}) {
    // Examples (using command line):
    // ffmpeg -ss 61.0 -t 2.5 -i test.mp4 -filter_complex "[0:v] fps=12,scale=320:-1,split [a][b];[a] palettegen [p];[b][p] paletteuse" test.gif
    // ffmpeg -ss 1.0 -t 2.5 -i test.mp4 -filter_complex "[0:v] fps=12,scale=320:180,split [a][b];[a] palettegen [p];[b][p] paletteuse" test.gif

    return new Promise((resolve, reject) => {
        const ext = path.extname(fileName);
        let outputFileName = null;

        function onComplete() {
            resolve(path.basename(outputFileName));
        }

        const defaults = {
            filename: '%b-%r-thumbnail.gif',
            progress: progress => { /* progress.percent */ },
            fps: 10,
            multiplier: 1,
            duration: 2.5,
            timemark: 5.0,
            logger: console,
            size: '320x180' // 16:9
        };
        const merged = {
            ...defaults,
            ...options
        };
        const multiplier = merged.multiplier === 1 ? '' : `,setpts=(1/${merged.multiplier})*PTS`;
        const scale = merged.size.replace('x', ':');
        const inputOptions = [
            `-ss ${merged.timemark}`,
            `-t ${merged.duration}`
        ];

        outputFileName = merged.filename
            .replace('%b', fileName.substr(0, fileName.length - ext.length))
            .replace('%r', merged.size.replace('?', ''));

        ffmpeg({
            source: fileName,
            logger: merged.logger
        })
            .on('progress', merged.progress)
            .on('end', onComplete)
            .on('error', reject)
            .inputOptions(inputOptions)
            .addOutputOption('-filter_complex', `[0:v] fps=${merged.fps}${multiplier},scale=${scale},split [a][b];[a] palettegen [p];[b][p] paletteuse`)
            .output(outputFileName)
            .run();
    });
}

export function convertVideo(fileName, options = {}) {
    return new Promise((resolve, reject) => {
        const ext = path.extname(fileName);
        let outputFileName = null;

        function onComplete() {
            resolve(path.basename(outputFileName));
        }

        const defaults = {
            filename: '%b-converted.%f',
            progress: progress => { /* progress.percent */ },
            //fps: 10,
            //multiplier: 1,
            //duration: 2.5,
            //timemark: 5.0,
            logger: console,
            //audioCodec: 'libfaac',
            audioCodec: 'libmp3lame',
            videoCodec: 'libx264',
            format: 'mp4'
            //size: '320x180' // 16:9
        };
        const merged = {
            ...defaults,
            ...options
        };

        outputFileName = merged.filename
            .replace('%b', fileName.substr(0, fileName.length - ext.length))
            .replace('%f', merged.format);

        ffmpeg({
            source: fileName,
            logger: merged.logger
        })
            .on('end', onComplete)
            .on('error', reject)
            .on('progress', merged.progress)
            .audioCodec(merged.audioCodec)
            .videoCodec(merged.videoCodec)
            .addOutputOption('-preset', 'faster')
            //.addOutputOption('-c:a', 'copy')
            .format(merged.format)
            .save(outputFileName);

    });
}
