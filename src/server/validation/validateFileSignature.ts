import { Buffer } from 'node:buffer';
import { Express } from 'express';
import { CustomErrorTemplateValidatorType } from '../../common/validation/customErrorTemplateValidator';
import { close, open, read, stat } from '../utils/fileSystem';
import { getFileExtension, getFileName, isArrayEmpty } from '../../common';
import { defaultFileSignature, FileSignatureType, FileSignaturePositions, FileTypesType } from '../../config/fileTypes';

const isProduction = process.env.NODE_ENV === 'production';

type ExpressFile = Express.Multer.File;

export type DefaultFileSignatureValidatorOptionsType = CustomErrorTemplateValidatorType;

export type FileSignatureValidatorOptionsType = Partial<DefaultFileSignatureValidatorOptionsType> & {
    value: Record<string, FileTypesType>;
};

export const defaultFileSignatureValidatorOptions: DefaultFileSignatureValidatorOptionsType = {
    errorTemplate: '{{label}} {{filename}} is an invalid file.',
    label: 'Value',
};

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

const validateFileSignature = (
    value: ExpressFile,
    options: FileSignatureValidatorOptionsType,
) => new Promise<string>((resolve, reject) => {
    const mergedOptions: FileSignatureValidatorOptionsType = {
        ...defaultFileSignatureValidatorOptions,
        ...options,
    };

    if (!mergedOptions.value) {
        resolve('');
        return;
    }

    (async () => {
        const findSignatures = (extension: string) => {
            const entry = Object
                .entries(mergedOptions.value!)
                .find(([, v]) => v?.extensions?.includes(extension))
            ;

            return entry ? entry[1]?.signatures || [] : [];
        };
        const fileName = getFileName(value);
        const fileExtension = getFileExtension(value);

        if (!fileExtension) {
            resolve('');
            return;
        }

        const signatures = findSignatures(fileExtension);

        if (isArrayEmpty(signatures)) {
            resolve('');
            return;
        }

        try {
            const results = await Promise.all(signatures.map(
                signature => validate(value)(signature as FileSignatureType),
            ));

            if (results.filter(Boolean).length === signatures.length) {
                resolve('');
                return;
            }

            resolve(
                mergedOptions
                    .errorTemplate!
                    .replace(/\{\{label}}/g, mergedOptions.label!)
                    .replace(/\{\{filename}}/g, fileName),
            );
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
