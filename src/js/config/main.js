const publicPath = 'data/uploads';
const path = `dist/${publicPath}`;

const config = {
    app: {
        port: 3001,
        videoUpload: {
            thumbnailDimensions: '320x180', // 16:9
            maxFileSize: 1024 * 1024 * 150,
            maxTotalFileSize: 1024 * 1024 * 1024,
            maxFiles: 10,
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
            publicPath,
            filenameGenerator(fileName) {
                return `${Date.now()}-${fileName}`;
            }
        },
        endpoints: {
            api: {
                video: {
                    upload: '/api/video/upload',
                    get: '/api/video/get'
                }
            }
        }
    }
};

export const testConfig = {
    app: {
        ...config.app,
        videoUpload: {
            ...config.app.videoUpload,
            maxFileSize: 10,
            maxTotalFileSize: 40,
            maxFiles: 5,
            allowedFileTypes: [
                'video/mp4'
            ]
        }
    }
};

export default config;
