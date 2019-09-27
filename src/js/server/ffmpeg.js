const config = require('../config/main');
const get = require('lodash/get');
const ffmpeg = require('fluent-ffmpeg');

const uploadPath = get(config, 'app.videoUpload.path', 'dist/uploads');

function getVideoInfo(fileName) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(fileName, function(err, data){
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function generatePoster(fileName, options) {
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
            //size: ''
        };

        options = { ...defaults, ...options };

        ffmpeg({
            source: fileName,
            logger: console
        })
            .on('filenames', onFilenames)
            .on('end', onComplete)
            .on('error', reject)
            .screenshot(options);

    });
}

function generateThumbnail(fileName, options) {
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

        options = { ...defaults, ...options };

        ffmpeg({
            source: fileName,
            logger: console
        })
            .on('filenames', onFilenames)
            .on('end', onComplete)
            .on('error', reject)
            .screenshot(options);

    });
}

// function saveImage(fileName, outputFileName) {
//
//     const options = {
//         folder: uploadPath,
//         filename: '%b-poster-%r.png',
//         count: 1,
//         timemark: '1%',
//         logger: console
//         //size: ''
//     };
//     const command = ffmpeg({
//         source: fileName,
//         logger: console
//     })
//         .on('filenames', function(filenames){
//             console.log('ffmpeg filenames', filenames)
//         })
//         .on('end', function(stdout, stderr){
//             console.log('ffmpeg end');
//         })
//         .on('error', function(err, stdout, stderr){
//             console.log('ffmpeg error', err.message);
//         })
//         .screenshot(options);
// }
//
// // ffmpeg
// //     .ffprobe(`${uploadPath}/1569553988266-Dare Iced Coffee - Juvenile Mate.mp4`, function(err, data){
// //         console.log('ffmpeg metadata', data);
// //     });
//
// const command = ffmpeg({
//     source: `${uploadPath}/1569553988266-Dare Iced Coffee - Juvenile Mate.mp4`,
//     logger: console
// })
//
//     //.output(`${uploadPath}/ela-screenshot.png`)
//     //.noAudio()
//     //.seek('0:01')
//     .on('filenames', function(filenames){
//         console.log('ffmpeg filenames', filenames)
//     })
//     .on('codecData', function(data) {
//         console.log(`ffmpeg codecData ${data.audio} audio with ${data.video} video`);
//     })
//     .on('progress', function(progress){
//         console.log(`ffmpeg processing: ${progress.percent}% done`);
//     })
//     .on('start', function(commandLine){
//         console.log('ffmpeg start', commandLine);
//     })
//     .on('end', function(stdout, stderr){
//         console.log('ffmpeg end');
//     })
//     .on('error', function(err, stdout, stderr){
//         console.log('ffmpeg error', err.message);
//     })
//     //.run();
//     .screenshot({
//         folder: uploadPath,
//         filename: '%b-poster-%r.png',
//         count: 1,
//         timemark: '1%',
//         //size: ''
//     });

module.exports = {
    getVideoInfo,
    generatePoster,
    generateThumbnail
};
