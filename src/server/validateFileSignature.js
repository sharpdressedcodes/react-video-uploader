import path from 'node:path';
import { Buffer } from 'node:buffer';
import { close, open, read, stat } from './fileSystem';

const validate = file => signature => new Promise((resolve, reject) => {
    (async () => {
        const { check, length, position } = signature;
        let fd = null;

        try {
            const stats = await stat(file.path);

            if (stats.size < length) {
                resolve(false);
                return;
            }

            const buffer = Buffer.alloc(length, null, 'utf8');
            const startPosition = position === 'end' ? stats.size - length : 0;

            fd = await open(file.path, 'r');

            await read(fd, buffer, 0, buffer.length, startPosition);
            await close(fd);

            resolve(check(buffer.toString('utf8')));
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

const validateFileSignature = (file, fileSignatures = {}) => new Promise((resolve, reject) => {
    (async () => {
        const fileExtension = path.extname(file.path).replace(/^\./, '');

        if (!Object.keys(fileSignatures).includes(fileExtension)) {
            resolve(true);
            return;
        }

        const signatures = fileSignatures[fileExtension];

        if (!signatures) {
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
