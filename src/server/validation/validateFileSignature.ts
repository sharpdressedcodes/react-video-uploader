import { Buffer } from 'node:buffer';
import { Express } from 'express';
import { close, open, read, stat } from '../utils/fileSystem';
import { getFileExtension, isArrayEmpty } from '../../common';
import { defaultFileSignature, FileSignatureType, FileSignaturePositions, FileTypesType } from '../../config/fileTypes';
import { ConfigType } from '../../config';

const isProduction = process.env.NODE_ENV === 'production';

type ExpressFile = Express.Multer.File;

const validate = (file: ExpressFile) => (signature: FileSignatureType) => new Promise<boolean>((resolve, reject) => {
    (async () => {
        // const { check = () => true, length = 0, offset = 0, position = 'start', value = null } = signature;
        const { length, value, offset, position, check }: FileSignatureType = {
            ...defaultFileSignature,
            ...signature,
        };
        let fd = null;

        try {
            const { size: fileSize } = await stat(file.path);

            if (fileSize < (offset as number) + length) {
                resolve(false);
                return;
            }

            const buffer = Buffer.alloc(length, void 0, 'utf8');
            const startPosition = (position === FileSignaturePositions.end ? fileSize - length : 0) + (offset as number);

            fd = await open(file.path, 'r');

            await read(fd, buffer, 0, buffer.length, startPosition);
            await close(fd);

            if (value) {
                resolve(Buffer.from(value, 'binary').compare(buffer) === 0);
                return;
            }

            if (check) {
                resolve(check(buffer));
            }
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

const validateFileSignature = (file: ExpressFile, allowedFileTypes?: ConfigType['allowedFileTypes']) => new Promise<boolean>((resolve, reject) => {
    if (!allowedFileTypes) {
        resolve(true);
        return;
    }

    (async () => {
        const findSignatures = (extension: string) => {
            const entry = Object
                .entries(allowedFileTypes)
                .find(([, v]) => v?.extensions?.includes(extension))
            ;

            return entry ? entry[1]?.signatures || [] : [];
        };
        const fileExtension = getFileExtension(file);

        if (!fileExtension) {
            resolve(true);
            return;
        }

        const signatures = findSignatures(fileExtension);

        if (isArrayEmpty(signatures)) {
            resolve(true);
            return;
        }

        try {
            // const results = await Promise.all(signatures.map(validate(file)));
            const results = await Promise.all(signatures.map(
                signature => validate(file)(signature as FileSignatureType),
            ));

            resolve(results.every(result => result));
        } catch (err) {
            if (!isProduction) {
                // eslint-disable-next-line no-console
                console.error(err);
            }

            reject(err);
        }
    })();
});

export default validateFileSignature;
