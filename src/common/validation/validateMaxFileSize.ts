import { Express } from 'express';
import getFileName from '../getFileName';
import { CustomErrorTemplateValidatorType } from './customErrorTemplateValidator';

export type DefaultMaxFileSizeValidatorOptionsType = CustomErrorTemplateValidatorType;

export type MaxFileSizeValidatorOptionsType = Partial<DefaultMaxFileSizeValidatorOptionsType> & {
    value: number;
};

export const defaultMaxFileSizeValidatorOptions: DefaultMaxFileSizeValidatorOptionsType = {
    errorTemplate: '{{label}} {{filename}} is too large.',
    label: 'Value',
};

const validateMaxFileSize = (
    value: File | Express.Multer.File,
    options: MaxFileSizeValidatorOptionsType,
): string => {
    const mergedOptions: MaxFileSizeValidatorOptionsType = {
        ...defaultMaxFileSizeValidatorOptions,
        ...options,
    };
    const fileName = getFileName(value);

    if (mergedOptions.value && value.size > mergedOptions.value) {
        return mergedOptions
            .errorTemplate!
            .replace(/\{\{label}}/g, mergedOptions.label!)
            .replace(/\{\{filename}}/g, fileName)
        ;
    }

    return '';
};

export default validateMaxFileSize;
