const publicPath = 'data/uploads';
const path = `dist/${publicPath}`;

const config = {
    app: {
        port: 3001,
        videoUpload: {
            maxFileSize: 10,
            maxTotalFileSize: 40,
            maxFiles: 5,
            allowedFileTypes: [
                'video/mp4',
            ],
            path,
            publicPath,
            filenameGenerator(fileName) {
                return `${Date.now()}-${fileName}`;
            },
        },
        endpoints: {
            api: {
                video: {
                    upload: '/api/video/upload',
                    get: '/api/video/get',
                },
            },
        },
    },
};

module.exports = config;
