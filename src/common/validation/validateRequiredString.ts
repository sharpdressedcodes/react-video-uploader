import { CustomErrorTemplateValidatorType } from './customErrorTemplateValidator';

export type DefaultRequiredStringValidatorOptionsType = CustomErrorTemplateValidatorType;

export type RequiredStringValidatorOptionsType = Partial<DefaultRequiredStringValidatorOptionsType> & {
    value: boolean;
};

export const defaultRequiredStringValidatorOptions: RequiredStringValidatorOptionsType = {
    errorTemplate: '{{label}} is required.',
    label: 'Value',
    value: true,
};

const validateRequiredString = (
    value: string,
    options: RequiredStringValidatorOptionsType,
): string => {
    const mergedOptions: RequiredStringValidatorOptionsType = {
        ...defaultRequiredStringValidatorOptions,
        ...options,
    };

    if (mergedOptions.value && !value.length) {
        return mergedOptions.errorTemplate!.replace(/\{\{label}}/g, mergedOptions.label!);
    }

    return '';
};

export default validateRequiredString;
