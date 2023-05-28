import formatFileSize from './formatFileSize';
import getFileExtension from './getFileExtension';
import getFileName from './getFileName';
import validateFileExtension from './validateFileExtension';
import validateFileSize from './validateFileSize';
import isArrayEmpty from './isArrayEmpty';
import isObjectEmpty from './isObjectEmpty';

export type FileValidatorType = {
    file: File | Express.Multer.File
    maxFileSize: number
    allowedFileExtensions: string[]
}

export type CustomFileValidatorMethod = (file: File | Express.Multer.File) => MaybePromiseType<object>;

export default class FileValidator {
    protected allowedFileExtensions: string[] = [];
    protected errors: string[] = [];
    protected file: File | Express.Multer.File;
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
