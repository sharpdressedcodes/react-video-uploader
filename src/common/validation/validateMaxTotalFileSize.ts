import { Express } from 'express';
import formatFileSize from '../formatFileSize';
import { CustomErrorTemplateValidatorType } from './customErrorTemplateValidator';

type ExpressFile = Express.Multer.File;
type BrowserOrServerFile = File | ExpressFile;

export type DefaultMaxTotalFileSizeValidatorOptionsType = CustomErrorTemplateValidatorType;

export type MaxTotalFileSizeValidatorOptionsType = Partial<DefaultMaxTotalFileSizeValidatorOptionsType> & {
    value: number;
};

export const defaultMaxTotalFileSizeValidatorOptions: DefaultMaxTotalFileSizeValidatorOptionsType = {
    errorTemplate: '{{label}} Total file size exceeds limit of {{size}}.',
    label: 'Value',
};

const validateMaxTotalFileSize = (
    files: BrowserOrServerFile[],
    options: MaxTotalFileSizeValidatorOptionsType,
): string => {
    const mergedOptions: MaxTotalFileSizeValidatorOptionsType = {
        ...defaultMaxTotalFileSizeValidatorOptions,
        ...options,
    };

    if (!mergedOptions.value) {
        return '';
    }

    const totalSize = files.reduce((acc: number, curr: BrowserOrServerFile) => acc + curr.size, 0);

    if (totalSize > mergedOptions.value) {
        return mergedOptions
            .errorTemplate!
            .replace(/\{\{label}}/g, mergedOptions.label!)
            .replace(/\{\{size}}/g, formatFileSize(mergedOptions.value))
        ;
    }

    return '';
};

export default validateMaxTotalFileSize;
