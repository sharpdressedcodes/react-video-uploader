import FileValidator, { CustomFileValidatorMethod, FileValidatorType } from './FileValidator';
import FilesValidator, { CustomFilesValidatorMethod, FilesValidatorType } from './FilesValidator';
import isArrayEmpty from './isArrayEmpty';

type BrowserOrServerFile = File;// | Express.Multer.File;
export type ConvertedFileType = Pick<BrowserOrServerFile, 'lastModified' | 'name' | 'size' | 'type'>;

// Strip properties that won't serialise.
const convertFile = ({ lastModified, name, size, type }: BrowserOrServerFile): ConvertedFileType => ({
    lastModified,
    name,
    size,
    type,
});

export type FileValidationValidationType = {
    fileErrors: Nullable<Record<number, string[]>>;
    overallErrors: Nullable<string[]>;
    validFiles: Nullable<ConvertedFileType[]>;
    invalidFiles: Nullable<ConvertedFileType[]>;
    success: boolean;
}

export type FileValidationType = {
    allowedFileExtensions?: string[]
    customValidator?: Nullable<CustomFileValidatorMethod>
    files: Array<BrowserOrServerFile>
    maxFiles?: number
    maxFileSize?: number
    maxTotalFileSize?: number
}

export type ValidationResultType = {
    errors: object
    valid: ConvertedFileType[]
    invalid: ConvertedFileType[]
}

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
    const validFiles: ConvertedFileType[] = [];
    const invalidFiles: ConvertedFileType[] = [];
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
            errors, valid, invalid
        }: ValidationResultType = validationResults.reduce<ValidationResultType>(
            (acc, curr, index): ValidationResultType => {
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
            }, { errors: {}, valid: [], invalid: [] }
        );

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
