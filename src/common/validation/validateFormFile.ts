import { Express } from 'express';
import validateRequiredArray from './validateRequiredArray';
import validateFileExtension from './validateFileExtension';
import validateMaxFileSize from './validateMaxFileSize';
import validateMaxArrayLength from './validateMaxArrayLength';
import validateMaxTotalFileSize from './validateMaxTotalFileSize';
import { isArrayEmpty } from '../index';

type BrowserOrServerFile = File | Express.Multer.File;

const validateFormFile = (
    value: BrowserOrServerFile[],
    rules: Nullable<Record<string, any>>,
): Record<string, any> => {
    const errors: Record<string, string[]> = {};
    let error = null;

    if (rules!.required) {
        error = validateRequiredArray(value, rules!.required);

        if (error) {
            errors.form = [error];

            return errors;
        }
    }

    value?.forEach((f, index) => {
        const fileErrors = [
            validateFileExtension(f, rules!.allowedFileExtensions),
            validateMaxFileSize(f, rules!.maxFileSize),
        ].filter(Boolean);

        if (!isArrayEmpty(fileErrors)) {
            errors[index] = fileErrors;
        }
    });

    if (!isArrayEmpty(value)) {
        let err = validateMaxArrayLength(value, rules!.maxArrayLength);

        if (err) {
            errors.form = [
                ...(errors.form || []),
                err,
            ].filter(Boolean);
        }

        err = validateMaxTotalFileSize(value, rules!.maxTotalFileSize);

        if (err) {
            errors.form = [
                ...(errors.form || []),
                err,
            ].filter(Boolean);
        }
    }

    return errors;
};

export default validateFormFile;
