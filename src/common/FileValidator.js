import formatFileSize from './formatFileSize';
import getFileName from './getFileName';
import validateFileSize from './validateFileSize';
import validateMimeType from './validateMimeType';
import isArrayEmpty from './isArrayEmpty';
import isObjectEmpty from './isObjectEmpty';

export default class FileValidator {
    #allowedFileTypes = [];

    #errors = [];

    #file = null;

    #maxFileSize = 0;

    constructor({ file, maxFileSize = 0, allowedFileTypes = [] }) {
        this.#file = file;
        this.#maxFileSize = maxFileSize;
        this.#allowedFileTypes = allowedFileTypes;
    }

    get validationErrors() {
        return this.#errors;
    }

    async validate(customValidator = null) {
        const { #file: file, #maxFileSize: maxFileSize, #allowedFileTypes: allowedFileTypes } = this;
        const fileName = getFileName(file);

        this.#errors = [];

        if (!validateMimeType(file, allowedFileTypes)) {
            this.#errors.push(`Error: ${fileName} is in an unsupported format (${file.type})`);
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
