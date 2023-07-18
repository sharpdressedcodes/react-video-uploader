import { CustomErrorTemplateValidatorType } from './customErrorTemplateValidator';

export type DefaultMinStringLengthValidatorOptionsType = CustomErrorTemplateValidatorType;

export type MinStringLengthValidatorOptionsType = Partial<DefaultMinStringLengthValidatorOptionsType> & {
    value: number;
};

export const defaultMinStringLengthValidatorOptions: DefaultMinStringLengthValidatorOptionsType = {
    errorTemplate: '{{label}} is too short.',
    label: 'Value',
};

const validateMinStringLength = (
    value: string,
    options: MinStringLengthValidatorOptionsType,
): string => {
    const mergedOptions: MinStringLengthValidatorOptionsType = {
        ...defaultMinStringLengthValidatorOptions,
        ...options,
    };

    if (mergedOptions.value && value.length < mergedOptions.value) {
        return mergedOptions.errorTemplate!.replace(/\{\{label}}/g, mergedOptions.label!);
    }

    return '';
};

export default validateMinStringLength;
