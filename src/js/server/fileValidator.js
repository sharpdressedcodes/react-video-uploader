import path from 'path';
import get from 'lodash/get';
import { getFileName, getMimeType, validateMaxFiles, validateMimeType, validateFileSize } from '../shared/fileValidations';
import { open, read, close, fileExists, unlink } from './fileOperations';
import { formatFileSize } from '../shared/format';
import signatures from './fileSignatures';
import config from '../config/main';

const maxFiles = get(config, 'app.videoUpload.maxFiles', 0);
const maxFileSize = get(config, 'app.videoUpload.maxFileSize', 0);
const maxTotalFileSize = get(config, 'app.videoUpload.maxTotalFileSize', 0);

export function validateFileSignature(file) {
    return new Promise(async (resolve, reject) => {

        const ext = path.extname(file.path).replace(/^\./, '');
        const signature = signatures[ext];
        let fd = null;

        if (!signature) {
            resolve(true);
            return;
        }

        try {
            const stats = await fileExists(file.path);
            // The signature can be an object or an array of objects.
            const checks = Array.isArray(signature) ? signature : [signature];
            const promises = checks.map(async check => new Promise(async (innerResolve, innerReject) => {
                if (stats.size < check.length) {
                    innerResolve(false);
                }

                const buffer = Buffer.alloc(check.length, null, 'utf8');

                fd = await open(file.path, 'r');

                let startPosition = 0;

                switch (check.position) {
                    case 'start':
                        // Do nothing
                        break;
                    case 'end':
                        startPosition = stats.size - check.length;
                        break;
                    default:
                }

                await read(fd, buffer, 0, buffer.length, startPosition);
                await close(fd);

                const str = buffer.toString('utf8');

                innerResolve(check.check(str));
            }));
            const result = await Promise.all(promises);

            // If any of the results are false, then the result will be 0
            resolve(result.reduce((acc, curr) => acc * curr) > 0);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);

            if (fd) {
                try {
                    await close(fd);
                } catch {
                    // Do nothing
                }
            }

            reject(err);
        }
    });
}

export async function validateFiles(files) {

    const errors = [];
    const totalSize = files.reduce((acc, curr) => acc.size + curr.size);

    if (!validateMaxFiles(files)) {
        errors.push(`Only ${maxFiles} files can be uploaded at a time`);
    }

    let promises = files.map(file => new Promise(async (resolve, reject) => {
        const innerErrors = [];
        let valid = true;

        try {
            if (!validateMimeType(file)) {
                valid = false;
                innerErrors.push(`${getFileName(file)} is in an unsupported format (${getMimeType(file)})`);
            }

            if (!validateFileSize(file)) {
                valid = false;
                innerErrors.push(`${getFileName(file)} is too large (limit ${formatFileSize(maxFileSize)}), please select a smaller file`);
            }

            if (!await validateFileSignature(file)) {
                valid = false;
                innerErrors.push(`${getFileName(file)} is an invalid file`);
            }

            if (!valid) {
                await unlink(file.path);
            }

            resolve({ errors: innerErrors });
        } catch (err) {
            reject(err);
        }
    }));

    try {
        const validationResult = await Promise.all(promises);

        if (validationResult[0].errors.length) {
            validationResult[0].errors.forEach(item => {
                errors.push(item);
            });
        }

        if (maxTotalFileSize && totalSize > maxTotalFileSize) {
            errors.push(`Error: Total file size exceeds limit of ${formatFileSize(maxTotalFileSize)}`);

            promises = files
                .map(file => file.path)
                .map(unlink);

            await Promise.all(promises);
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        errors.push(`Error: ${err.message}`);
    }

    return errors.length ? errors : true;
}
