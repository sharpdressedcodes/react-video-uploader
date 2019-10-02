const publicPath = 'data/uploads';
const path = `dist/${publicPath}`;

const config = {
    app: {
        port: 3001,
        videoUpload: {
            maxFileSize: 1024 * 1024 * 150,
            maxTotalFileSize: 1024 * 1024 * 1024,
            maxFiles: 10,
            allowedFileTypes: [
                // 'video/x-flv',
                'video/mp4',
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

//module.exports = config;
export default config;
