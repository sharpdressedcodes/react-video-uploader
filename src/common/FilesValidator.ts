import formatFileSize from './formatFileSize';
import validateMaxFiles from './validateMaxFiles';
import validateTotalFileSize from './validateTotalFileSize';
import isArrayEmpty from './isArrayEmpty';
import isObjectEmpty from './isObjectEmpty';

export type FilesValidatorType = {
    files: Array<File | Express.Multer.File>
    maxFiles: number
    maxTotalFileSize: number
}

export type CustomFilesValidatorMethod = (files: Array<File | Express.Multer.File>) => MaybePromiseType<object>;

export default class FilesValidator {
    protected errors: string[] = [];

    protected files: Array<File | Express.Multer.File> = [];

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
