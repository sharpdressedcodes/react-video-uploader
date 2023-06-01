import { Express } from 'express';
import formatFileSize from '../formatFileSize';
import getFileExtension from '../getFileExtension';
import getFileName from '../getFileName';
import isArrayEmpty from '../isArrayEmpty';
import isObjectEmpty from '../isObjectEmpty';
import validateFileExtension from './validateFileExtension';
import validateFileSize from './validateFileSize';

type ExpressFile = Express.Multer.File;
type BrowserOrServerFile = File | ExpressFile;

export type FileValidatorType = {
    file: BrowserOrServerFile;
    maxFileSize: number;
    allowedFileExtensions: string[];
};

export type CustomFileValidatorMethod = (file: BrowserOrServerFile) => MaybePromiseType<object>;

export default class FileValidator {
    protected allowedFileExtensions: string[] = [];

    protected errors: string[] = [];

    protected file: BrowserOrServerFile;

    protected maxFileSize = 0;

    constructor({ file, maxFileSize = 0, allowedFileExtensions = [] }: FileValidatorType) {
        this.file = file;
        this.maxFileSize = maxFileSize;
        this.allowedFileExtensions = allowedFileExtensions;
    }

    get validationErrors(): string[] {
        return this.errors;
    }

    async validate(customValidator: Nullable<CustomFileValidatorMethod> = null): Promise<boolean> {
        const {
            file,
            maxFileSize,
            allowedFileExtensions,
        } = this;
        const fileName: string = getFileName(file);
        const fileExtension: string | null = getFileExtension(file);

        this.errors = [];

        if (!validateFileExtension(file, allowedFileExtensions)) {
            this.errors.push(`Error: ${fileName} has an unsupported file extension (${fileExtension})`);
        }

        if (!validateFileSize(file, maxFileSize)) {
            this.errors.push(`Error: ${fileName} is too large (limit ${formatFileSize(maxFileSize)}), please select a smaller file`);
        }

        if (customValidator) {
            try {
                const custom: MaybePromiseType<object> = customValidator(file);
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