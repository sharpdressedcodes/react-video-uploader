import { Express } from 'express';
import getFileExtension from '../getFileExtension';
import getFileName from '../getFileName';
import isArrayEmpty from '../isArrayEmpty';
import { CustomErrorTemplateValidatorType } from './customErrorTemplateValidator';

type BrowserOrServerFile = File | Express.Multer.File;

export type DefaultFileExtensionValidatorOptionsType = CustomErrorTemplateValidatorType;

export type FileExtensionValidatorOptionsType = Partial<DefaultFileExtensionValidatorOptionsType> & {
    value: string[];
};

export const defaultFileExtensionValidatorOptions: DefaultFileExtensionValidatorOptionsType = {
    errorTemplate: '{{label}} {{filename}} has an unsupported file extension.',
    label: 'Value',
};

const validateFileExtension = (
    value: BrowserOrServerFile,
    options: FileExtensionValidatorOptionsType,
): string => {
    const mergedOptions: FileExtensionValidatorOptionsType = {
        ...defaultFileExtensionValidatorOptions,
        ...options,
    };
    const fileName = getFileName(value);
    const fileExtension = getFileExtension(value);

    if (!isArrayEmpty(mergedOptions.value) && fileExtension) {
        if (!mergedOptions.value!.find(ext => ext.toLowerCase() === fileExtension.toLowerCase())) {
            return mergedOptions
                .errorTemplate!
                .replace(/\{\{label}}/g, mergedOptions.label!)
                .replace(/\{\{filename}}/g, fileName)
            ;
        }
    }

    // No extensions means allow everything
    return '';
};

export default validateFileExtension;
