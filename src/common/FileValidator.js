import formatFileSize from './formatFileSize';
import getFileExtension from './getFileExtension';
import getFileName from './getFileName';
import validateFileExtension from './validateFileExtension';
import validateFileSize from './validateFileSize';
import isArrayEmpty from './isArrayEmpty';
import isObjectEmpty from './isObjectEmpty';

export default class FileValidator {
    #allowedFileExtensions = [];

    #errors = [];

    #file = null;

    #maxFileSize = 0;

    constructor({ file, maxFileSize = 0, allowedFileExtensions = [] }) {
        this.#file = file;
        this.#maxFileSize = maxFileSize;
        this.#allowedFileExtensions = allowedFileExtensions;
    }

    get validationErrors() {
        return this.#errors;
    }

    async validate(customValidator = null) {
        const { #file: file, #maxFileSize: maxFileSize, #allowedFileExtensions: allowedFileExtensions } = this;
        const fileName = getFileName(file);
        const fileExtension = getFileExtension(file);

        this.#errors = [];

        if (!validateFileExtension(file, allowedFileExtensions)) {
            this.#errors.push(`Error: ${fileName} has an unsupported file extension (${fileExtension})`);
        }

        if (!validateFileSize(file, maxFileSize)) {
            this.#errors.push(`Error: ${fileName} is too large (limit ${formatFileSize(maxFileSize)}), please select a smaller file`);
        }

        if (customValidator) {
            try {
                const custom = customValidator(file);
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
