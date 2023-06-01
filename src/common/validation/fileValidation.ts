import isArrayEmpty from '../isArrayEmpty';
import getFileName from '../getFileName';
import getFilePath from '../getFilePath';
import getMimeType from '../getMimeType';
import FilesValidator from './FilesValidator';
import FileValidator, { CustomFileValidatorMethod } from './FileValidator';

type ExpressFile = Express.Multer.File;
type BrowserOrServerFile = File | ExpressFile;

export type NormalisedFileType = {
    name: string;
    path: string;
    size: number;
    type: string;
    baseType: string;
};

export type FileValidationValidationType = {
    fileErrors: Nullable<Record<number, string[]>>;
    overallErrors: Nullable<string[]>;
    validFiles: Nullable<BrowserOrServerFile[]>;
    invalidFiles: Nullable<NormalisedFileType[]>;
    success: boolean;
};

export type FileValidationType = {
    allowedFileExtensions?: string[];
    customValidator?: Nullable<CustomFileValidatorMethod>;
    files: Array<BrowserOrServerFile>;
    maxFiles?: number;
    maxFileSize?: number;
    maxTotalFileSize?: number;
};

export type ValidationResultType = {
    errors: object;
    valid: BrowserOrServerFile[];
    invalid: NormalisedFileType[];
};

// Normalise and strip properties that won't serialise.
const convertFile = (file: BrowserOrServerFile): NormalisedFileType => ({
    name: getFileName(file),
    path: getFilePath(file),
    size: file.size,
    type: getMimeType(file),
    baseType: Object.prototype.toString.call(file).replace(/^\[object (.*?)]$/, '$1'),
});

const fileValidation = async ({
    allowedFileExtensions = [],
    customValidator = null,
    files = [],
    maxFiles = 0,
    maxFileSize = 0,
    maxTotalFileSize = 0,
}: FileValidationType): Promise<FileValidationValidationType> => {
    const filesValidator = new FilesValidator({ files, maxFiles, maxTotalFileSize });
    const fileErrors: Record<number, string[]> = {};
    const overallErrors: string[] = [];
    const validFiles: BrowserOrServerFile[] = [];
    const invalidFiles: NormalisedFileType[] = [];
    const fileValidations: Promise<string[]>[] = files.map(file => new Promise<string[]>(resolve => {
        (async () => {
            try {
                const validator = new FileValidator({ file, maxFileSize, allowedFileExtensions });

                if (!await validator.validate(customValidator)) {
                    resolve(validator.validationErrors);
                    return;
                }

                resolve([]);
            } catch (err: unknown) {
                resolve([(err as Error).message]);
            }
        })();
    }));
    let success = true;

    try {
        if (!await filesValidator.validate()) {
            overallErrors.push(...filesValidator.validationErrors);
            success = false;
        }

        const validationResults = await Promise.all(fileValidations);
        const {
            errors, valid, invalid,
        }: ValidationResultType = validationResults.reduce<ValidationResultType>((
            acc,
            curr,
            index,
        ): ValidationResultType => {
            if (!isArrayEmpty(curr)) {
                return {
                    ...acc,
                    errors: {
                        ...acc.errors,
                        [index]: curr,
                    },
                    invalid: [
                        ...acc.invalid,
                        convertFile(files[index]),
                    ],
                };
            }

            return {
                ...acc,
                valid: [
                    ...acc.valid,
                    files[index],
                ],
            };
        }, { errors: {}, valid: [], invalid: [] });

        validFiles.push(...valid);
        invalidFiles.push(...invalid);

        if (!isArrayEmpty(invalid)) {
            Object.assign(fileErrors, errors);
            success = false;
        }
    } catch (err: unknown) {
        overallErrors.push(...(err as Error).message);
        success = false;
    }

    return { fileErrors, overallErrors, validFiles, invalidFiles, success };
};

export default fileValidation;
