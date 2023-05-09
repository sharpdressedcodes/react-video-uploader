const path = require('node:path');
const ffmpeg = require('fluent-ffmpeg');

const getVideoInfo = fileName => new Promise((resolve, reject) => {
    ffmpeg.ffprobe(fileName, (err, data) => {
        if (err) {
            reject(err);
            return;
        }

        resolve(data);
    });
});

const generatePoster = (fileName, options = {}) => new Promise((resolve, reject) => {
    let result = null;
    const onComplete = () => {
        resolve(result[0]);
    };
    const onFilenames = fns => {
        result = fns;
    };
    const defaults = {
        folder: path.dirname(fileName),
        filename: '%b-%r-poster.png',
        count: 1,
        timemark: '1%',
        logger: console,
        // size: ''
    };
    const merged = {
        ...defaults,
        ...options,
    };

    ffmpeg({ source: fileName, logger: merged.logger })
        .on('filenames', onFilenames)
        .on('end', onComplete)
        .on('error', reject)
        .screenshot(merged)
    ;
});

const generateThumbnail = (fileName, options = {}) => new Promise((resolve, reject) => {
    let result = null;
    const onComplete = () => {
        resolve(result[0]);
    };
    const onFilenames = fns => {
        result = fns;
    };
    const defaults = {
        folder: path.dirname(fileName),
        filename: '%b-%r-thumbnail.png',
        count: 1,
        timemark: '1%',
        logger: console,
        size: '320x180', // 16:9
    };
    const merged = {
        ...defaults,
        ...options,
    };

    ffmpeg({ source: fileName, logger: merged.logger })
        .on('filenames', onFilenames)
        .on('end', onComplete)
        .on('error', reject)
        .screenshot(merged)
    ;
});

const generateGif = (fileName, options = {}, info = {}) => new Promise((resolve, reject) => {
    // Examples (using command line):
    // ffmpeg -ss 61.0 -t 2.5 -i test.mp4 -filter_complex "[0:v] fps=12,scale=320:-1,split [a][b];[a] palettegen [p];[b][p] paletteuse" test.gif
    // ffmpeg -ss 1.0 -t 2.5 -i test.mp4 -filter_complex "[0:v] fps=12,scale=320:180,split [a][b];[a] palettegen [p];[b][p] paletteuse" test.gif
    let timemark = 5.0;
    let duration = 2.5;
    let outputFileName = null;
    const ext = path.extname(fileName);
    const onComplete = () => {
        resolve(path.basename(outputFileName));
    };

    // Make sure the time mark + duration of the gif doesn't go over the actual video duration
    if (info.format.duration < timemark + duration) {
        // First try setting the start to 0
        timemark = 0;

        // Also ensure duration doesn't go longer than actual video duration
        if (info.format.duration < duration) {
            duration = info.format.duration;
        }
    }

    const defaults = {
        filename: '%b-%r-thumbnail.gif',
        progress: Function.prototype, // progress => { /* progress.percent */ },
        fps: 10,
        multiplier: 1,
        duration, // : 2.5,
        timemark, // : 5.0,
        logger: console,
        size: '320x180', // 16:9
    };
    const merged = {
        ...defaults,
        ...options,
    };
    const multiplier = merged.multiplier === 1 ? '' : `,setpts=(1/${merged.multiplier})*PTS`;
    const scale = merged.size.replace('x', ':');
    const inputOptions = [
        `-ss ${merged.timemark}`,
        `-t ${merged.duration}`,
    ];

    outputFileName = merged.filename
        .replace('%b', fileName.substr(0, fileName.length - ext.length))
        .replace('%r', merged.size.replace('?', ''))
    ;

    ffmpeg({ source: fileName, logger: merged.logger })
        .on('progress', merged.progress)
        .on('end', onComplete)
        .on('error', reject)
        .inputOptions(inputOptions)
        .addOutputOption('-filter_complex', `[0:v] fps=${merged.fps}${multiplier},scale=${scale},split [a][b];[a] palettegen [p];[b][p] paletteuse`)
        .output(outputFileName)
        .run()
    ;
});

const convertVideo = (fileName, options = {}) => new Promise((resolve, reject) => {
    let outputFileName = null;
    const ext = path.extname(fileName);
    const onComplete = () => {
        resolve(path.basename(outputFileName));
    };
    const defaults = {
        filename: '%b-converted.%f',
        progress: Function.prototype, // progress => { /* progress.percent */ },
        // fps: 10,
        // multiplier: 1,
        // duration: 2.5,
        // timemark: 5.0,
        logger: console,
        // audioCodec: 'libfaac',
        audioCodec: 'libmp3lame',
        videoCodec: 'libx264',
        format: 'mp4',
        // size: '320x180' // 16:9
    };
    const merged = {
        ...defaults,
        ...options,
    };

    outputFileName = merged.filename
        .replace('%b', fileName.substr(0, fileName.length - ext.length))
        .replace('%f', merged.format)
    ;

    ffmpeg({ source: fileName, logger: merged.logger })
        .on('end', onComplete)
        .on('error', reject)
        .on('progress', merged.progress)
        .audioCodec(merged.audioCodec)
        .videoCodec(merged.videoCodec)
        .addOutputOption('-preset', 'faster')
        // .addOutputOption('-c:a', 'copy')
        .format(merged.format)
        .save(outputFileName)
    ;
});

module.exports = {
    getVideoInfo,
    generatePoster,
    generateThumbnail,
    generateGif,
    convertVideo,
};
