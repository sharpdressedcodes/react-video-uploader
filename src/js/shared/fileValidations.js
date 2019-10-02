import get from 'lodash/get';
import config from '../config/main';

const maxFiles = get(config, 'app.videoUpload.maxFiles', 0);
const maxFileSize = get(config, 'app.videoUpload.maxFileSize', 0);
const allowedFileTypes = get(config, 'app.videoUpload.allowedFileTypes', []);

export function getFileName(file) {
    return file.name || file.originalname;
}

export function getMimeType(file) {
    return file.type || file.mimetype;
}

export function validateMaxFiles(files) {
    return maxFiles === 0 || files.length <= maxFiles;
}

export function validateMimeType(file) {
    return allowedFileTypes.length === 0 || allowedFileTypes.indexOf(getMimeType(file)) > -1;
}

export function validateFileSize(file) {
    return maxFileSize === 0 || file.size <= maxFileSize;
}
