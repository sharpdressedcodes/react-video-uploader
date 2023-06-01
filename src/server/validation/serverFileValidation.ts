import { Express } from 'express';
import { fileValidation, FileValidationType, getFileName } from '../../common';
import { ConfigType } from '../../config';
import validateFileSignature from './validateFileSignature';

type ExpressFile = Express.Multer.File;
type BrowserOrServerFile = File | ExpressFile;

export type ServerValidationParamsType =
    Omit<FileValidationType, 'customValidator'> &
    Pick<ConfigType, 'allowedFileTypes'>
;

const serverFileValidation = async ({
    files = [],
    allowedFileTypes = {},
    allowedFileExtensions = [],
    maxFiles = 0,
    maxFileSize = 0,
    maxTotalFileSize = 0,
}: ServerValidationParamsType) => {
    const customValidator = (file: BrowserOrServerFile | BrowserOrServerFile[]) => new Promise<Record<number, string>>((resolve, reject) => {
        (async () => {
            try {
                const filesToCheck = (Array.isArray(file) ? file : [file]) as ExpressFile[];
                const promises = filesToCheck.map(item => validateFileSignature(item, allowedFileTypes));
                const result: Record<number, string> = (await Promise.all(promises)).reduce((acc, curr, index) => {
                    if (!curr) {
                        return {
                            ...acc,
                            [index]: [`Error: ${getFileName(filesToCheck[index])} is an invalid file`],
                        };
                    }

                    return { ...acc };
                }, {});

                resolve(result);
            } catch (err) {
                reject(err);
            }
        })();
    });

    return fileValidation({ files, customValidator, allowedFileExtensions, maxFiles, maxFileSize, maxTotalFileSize });
};

export default serverFileValidation;
