import { CustomErrorTemplateValidatorType } from './customErrorTemplateValidator';
import { isArrayEmpty } from '../index';

export type DefaultRequiredArrayValidatorOptionsType = CustomErrorTemplateValidatorType;

export type RequiredArrayValidatorOptionsType = Partial<DefaultRequiredArrayValidatorOptionsType> & {
    value: boolean;
};

export const defaultRequiredArrayValidatorOptions: RequiredArrayValidatorOptionsType = {
    errorTemplate: '{{label}} is required.',
    label: 'Value',
    value: true,
};

const validateRequiredArray = (
    value: any[],
    options: RequiredArrayValidatorOptionsType,
): string => {
    const mergedOptions: RequiredArrayValidatorOptionsType = {
        ...defaultRequiredArrayValidatorOptions,
        ...options,
    };

    if (mergedOptions.value && isArrayEmpty(value)) {
        return mergedOptions.errorTemplate!.replace(/\{\{label}}/g, mergedOptions.label!);
    }

    return '';
};

export default validateRequiredArray;
