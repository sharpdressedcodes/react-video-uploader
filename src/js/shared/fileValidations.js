import config from 'react-global-configuration';

export function getFileName(file) {
    return file.name || file.originalname;
}

export function getMimeType(file) {
    return file.type || file.mimetype;
}

export function validateMaxFiles(files) {
    const maxFiles = config.get('app.videoUpload.maxFiles', 0);
    return maxFiles === 0 || files.length <= maxFiles;
}

export function validateMimeType(file) {
    const allowedFileTypes = config.get('app.videoUpload.allowedFileTypes', []);
    return allowedFileTypes.length === 0 || allowedFileTypes.indexOf(getMimeType(file)) > -1;
}

export function validateFileSize(file) {
    const maxFileSize = config.get('app.videoUpload.maxFileSize', 0);
    return maxFileSize === 0 || file.size <= maxFileSize;
}
