import { validateMaxFiles, validateMimeType, validateFileSize } from './shared/fileValidations';
import { formatFileSize } from './shared/format';
import config from './config';

export function validateFiles(files) {
    const maxFiles = config.get('app.videoUpload.maxFiles', 0);
    const maxFileSize = config.get('app.videoUpload.maxFileSize', 0);
    const maxTotalFileSize = config.get('app.videoUpload.maxTotalFileSize', 0);
    const errors = [];
    let totalSize = 0;

    if (!validateMaxFiles(files)) {
        errors.push(`Only ${maxFiles} files can be uploaded at a time`);
    }

    files.forEach(file => {
        totalSize += file.size;

        if (!validateMimeType(file)) {
            errors.push(`${file.name} is in an unsupported format (${file.type})`);
        }

        if (!validateFileSize(file)) {
            errors.push(`${file.name} is too large (limit ${formatFileSize(maxFileSize)}), please select a smaller file`);
        }
    });

    if (maxTotalFileSize && totalSize > maxTotalFileSize) {
        errors.push(`Error: Total file size exceeds limit of ${formatFileSize(maxTotalFileSize)}`);
    }

    return errors.length ? errors : true;
}
