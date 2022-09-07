import get from 'lodash.get';

const publicPath = 'data/uploads';
const path = `build/${publicPath}`;
const maxFileSize = 1024 * 1024 * 150; // MB
const maxFiles = 10;

const config = {
    server: {
        hostName: '0.0.0.0',
        port: 3000,
        fileSignatures: {
            mp4: [{
                // Ignore first 4 bytes, only check the next 4
                position: 'start',
                length: 8,
                check: str => str.endsWith('ftyp')
            }]
        }
    },
    videoUpload: {
        thumbnailDimensions: '320x180', // 16:9
        maxFiles,
        maxFileSize,
        maxTotalFileSize: maxFileSize * maxFiles,
        allowedFileTypes: [
            // 'video/x-flv',
            'video/mp4'
            // 'application/x-mpegURL',
            // 'video/MP2T',
            // 'video/3gpp',
            // 'video/quicktime',
            // 'video/x-msvideo',
            // 'video/x-ms-wmv'
        ],
        path,
        publicPath
    },
    endpoints: {
        api: {
            video: {
                upload: '/api/video/upload',
                get: '/api/video/get'
            }
        }
    }
};

config.get = (value, defaultValue = null) => get(config, value, defaultValue);

export const testConfig = {
    ...config,
    videoUpload: {
        ...config.videoUpload,
        allowedFileTypes: ['video/mp4'],
        maxFiles: 5,
        maxFileSize: 10,
        maxTotalFileSize: 40
    }
};

testConfig.get = (value, defaultValue = null) => get(testConfig, value, defaultValue);

export default config;
