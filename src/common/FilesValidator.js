import formatFileSize from './formatFileSize';
import validateMaxFiles from './validateMaxFiles';
import validateTotalFileSize from './validateTotalFileSize';
import isArrayEmpty from './isArrayEmpty';
import isObjectEmpty from './isObjectEmpty';

export default class FilesValidator {
    #errors = [];

    #files = [];

    #maxFiles = 0;

    #maxTotalFileSize = 0;

    constructor({ files = [], maxFiles = 0, maxTotalFileSize = 0 }) {
        this.#files = files;
        this.#maxFiles = maxFiles;
        this.#maxTotalFileSize = maxTotalFileSize;
    }

    get validationErrors() {
        return this.#errors;
    }

    async validate(customValidator = null) {
        const { #files: files, #maxFiles: maxFiles, #maxTotalFileSize: maxTotalFileSize } = this;

        this.#errors = [];

        if (!validateMaxFiles(files, maxFiles)) {
            this.#errors.push(`Error: Only ${maxFiles} files can be uploaded at a time`);
        }

        if (!validateTotalFileSize(files, maxTotalFileSize)) {
            this.#errors.push(`Error: Total file size exceeds limit of ${formatFileSize(maxTotalFileSize)}`);
        }

        if (customValidator) {
            try {
                const custom = customValidator(files);
                const customErrors = custom instanceof Promise ? await custom : custom;

                if (!isObjectEmpty(customErrors)) {
                    Object.entries(customErrors).forEach(([, values]) => {
                        this.#errors.push(...values);
                    });
                }
            } catch {
                // Do nothing
            }
        }

        return isArrayEmpty(this.#errors);
    }
}
