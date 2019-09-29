const get = require('lodash/get');
const config = require('../config/main');
const { formatFileSize } = require('./format');
const signatures = require('./fileSignatures');

const maxFiles = get(config, 'app.videoUpload.maxFiles', 0);
const maxFileSize = get(config, 'app.videoUpload.maxFileSize', 0);
const maxTotalFileSize = get(config, 'app.videoUpload.maxTotalFileSize', 0);
const allowedFileTypes = get(config, 'app.videoUpload.allowedFileTypes', []);

function getFileName(file) {
    return file.name || file.originalname;
}

function getMimeType(file) {
    return file.type || file.mimetype;
}

// Exports
function validateMaxFiles(files) {
    return maxFiles === 0 || files.length <= maxFiles;
}

function validateMimeType(file) {
    return allowedFileTypes.length === 0 || allowedFileTypes.indexOf(getMimeType(file)) > -1;
}

function validateFileSize(file) {
    return maxFileSize === 0 || file.size <= maxFileSize;
}

function validateFileSignature(file) {
    return new Promise(async (resolve, reject) => {

        const path = require('path');
        // Hack for webpack to skip this require
        const fileOperations = eval("require('./fileOperations');");
        const { open, read, close, fileExists } = fileOperations;

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
            const len = checks.length;

            for (let i = 0; i < len; i++) {
                const check = checks[i];
                if (stats.size < check.length) {
                    resolve(false);
                    return;
                }

                const buffer = Buffer.alloc(check.length, null, 'utf8');
                fd = await open(file.path, 'r');

                let startPosition = 0;

                switch (check.position) {
                    case 'start':

                        break;
                    case 'end':
                        startPosition = stats.size - check.length - 1;
                        break;
                }

                await read(fd, buffer, 0, buffer.length, startPosition);
                await close(fd);

                const str = buffer.toString('utf8');

                if (!check.check(str)) {
                    resolve(false);
                }

            }

            resolve(true);

        } catch (err) {

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

/**
 * Server side validation.
 *
 * @param files The files to validate.
 * @returns Array|boolean True if valid, an array of errors otherwise.
 */
async function validateFilesServer(files) {

    // Hack for webpack to skip this require
    const fileOperations = eval("require('./fileOperations');");
    const errors = [];
    let totalSize = 0;

    if (!validateMaxFiles(files)) {
        errors.push(`Only ${maxFiles} files can be uploaded at a time`);
    }

    files.forEach(file => {
        totalSize += file.size;
    });

    let promises = files.map(file => {
        return new Promise(async (resolve, reject) => {

            const errors = [];
            let valid = true;

            if (!validateMimeType(file)) {
                valid = false;
                errors.push(`${getFileName(file)} is in an unsupported format (${getMimeType(file)})`);
            }

            if (!validateFileSize(file)) {
                valid = false;
                errors.push(`${getFileName(file)} is too large (limit ${formatFileSize(maxFileSize)}), please select a smaller file`);
            }

            if (!await validateFileSignature(file)) {
                valid = false;
                errors.push(`${getFileName(file)} is an invalid file`);
            }

            if (!valid) {
                await fileOperations.unlink(file.path);
            }

            resolve({ errors });

        });
    });

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
                .map(fileOperations.unlink);

            await Promise.all(promises);
        }

    } catch (err) {
        console.error(err);
        errors.push(`Error: ${err.message}`);
    }

    return errors.length ? errors : true;
}

/**
 * Client side validation.
 *
 * @param files The files to validate.
 * @returns Array|boolean True if valid, an array of errors otherwise.
 */
function validateFiles(files) {

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

module.exports = {
    validateMaxFiles,
    validateMimeType,
    validateFileSize,
    validateFileSignature,
    validateFiles,
    validateFilesServer
};
