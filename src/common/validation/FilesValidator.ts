import { Express } from 'express';
import formatFileSize from '../formatFileSize';
import isArrayEmpty from '../isArrayEmpty';
import isObjectEmpty from '../isObjectEmpty';
import validateMaxFiles from './validateMaxFiles';
import validateTotalFileSize from './validateTotalFileSize';

type ExpressFile = Express.Multer.File;
type BrowserOrServerFile = File | ExpressFile;

export type FilesValidatorType = {
    files: Array<BrowserOrServerFile>
    maxFiles: number
    maxTotalFileSize: number
};

export type CustomFilesValidatorMethod = (files: BrowserOrServerFile[]) => MaybePromiseType<object>;

export default class FilesValidator {
    protected errors: string[] = [];

    protected files: BrowserOrServerFile[] = [];

    protected maxFiles = 0;

    protected maxTotalFileSize = 0;

    constructor({ files = [], maxFiles = 0, maxTotalFileSize = 0 }: FilesValidatorType) {
        this.files = files;
        this.maxFiles = maxFiles;
        this.maxTotalFileSize = maxTotalFileSize;
    }

    get validationErrors(): string[] {
        return this.errors;
    }

    async validate(customValidator: Nullable<CustomFilesValidatorMethod> = null): Promise<boolean> {
        const { files, maxFiles, maxTotalFileSize } = this;

        this.errors = [];

        if (!validateMaxFiles(files, maxFiles)) {
            this.errors.push(`Error: Only ${maxFiles} files can be uploaded at a time`);
        }

        if (!validateTotalFileSize(files, maxTotalFileSize)) {
            this.errors.push(`Error: Total file size exceeds limit of ${formatFileSize(maxTotalFileSize)}`);
        }

        if (customValidator) {
            try {
                const custom: MaybePromiseType<object> = customValidator(files);
                const customErrors: object = custom instanceof Promise ? await custom : custom;

                if (!isObjectEmpty(customErrors)) {
                    Object.values(customErrors).forEach(values => {
                        this.errors.push(...values);
                    });
                }
            } catch {
                // Do nothing
            }
        }

        return isArrayEmpty(this.errors);
    }
}
