import { Buffer } from 'node:buffer';
import { close, open, read, stat } from './fileSystem';
import { getFileExtension, isArrayEmpty } from '../common';

const validate = file => signature => new Promise((resolve, reject) => {
    (async () => {
        const { check = () => true, length = 0, offset = 0, position = 'start', value = null } = signature;
        let fd = null;

        try {
            const { size: fileSize } = await stat(file.path);

            if (fileSize < offset + length) {
                resolve(false);
                return;
            }

            const buffer = Buffer.alloc(length, null, 'utf8');
            const startPosition = (position === 'end' ? fileSize - length : 0) + offset;

            fd = await open(file.path, 'r');

            await read(fd, buffer, 0, buffer.length, startPosition);
            await close(fd);

            if (value) {
                resolve(Buffer.from(value, 'binary').compare(buffer) === 0);
                return;
            }

            resolve(check(buffer));
        } catch (err) {
            if (fd) {
                try {
                    await close(fd);
                } catch {
                    // Do nothing
                }
            }

            reject(err);
        }
    })();
});

const validateFileSignature = (file, allowedFileTypes = {}) => new Promise((resolve, reject) => {
    (async () => {
        const findSignatures = extension => {
            const entry = Object.entries(allowedFileTypes).find(([, v]) => v?.extensions?.includes(extension));

            return entry ? entry[1]?.signatures || [] : [];
        };
        const fileExtension = getFileExtension(file);
        const signatures = findSignatures(fileExtension);

        if (isArrayEmpty(signatures)) {
            resolve(true);
            return;
        }

        try {
            const results = await Promise.all(signatures.map(validate(file)));

            resolve(results.every(result => result));
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
            reject(err);
        }
    })();
});

export default validateFileSignature;
