import get from 'lodash.get';
import { fileTypes as allowedFileTypes, fileExtensions as allowedFileExtensions } from './fileTypes';

const publicPath = 'data/uploads';
const path = `build/${publicPath}`;
const maxFileSize = 1024 * 1024 * 150; // MB
const maxFiles = 10;
const config = {
    allowedFileTypes,
    allowedFileExtensions,
    server: {
        hostName: '0.0.0.0',
        port: 3000,
    },
    videoUpload: {
        thumbnailDimensions: '320x180', // 16:9
        maxFiles,
        maxFileSize,
        maxTotalFileSize: maxFileSize * maxFiles,
        path,
        publicPath,
    },
    endpoints: {
        api: {
            video: {
                upload: '/api/video/upload',
                get: '/api/video/get',
            },
        },
    },
    webVitals: {
        // eslint-disable-next-line no-console
        callback: console.log,
        // enabled: process.env.NODE_ENV === 'development',
        enabled: false,
    },
};

config.get = (value, defaultValue = null) => get(config, value, defaultValue);

export const testConfig = {
    ...config,
    videoUpload: {
        ...config.videoUpload,
        maxFiles: 5,
        maxFileSize: 10,
        maxTotalFileSize: 40,
    },
};

testConfig.get = (value, defaultValue = null) => get(testConfig, value, defaultValue);

export default config;
