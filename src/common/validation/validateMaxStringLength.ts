import { CustomErrorTemplateValidatorType } from './customErrorTemplateValidator';

export type DefaultMaxStringLengthValidatorOptionsType = CustomErrorTemplateValidatorType;

export type MaxStringLengthValidatorOptionsType = Partial<DefaultMaxStringLengthValidatorOptionsType> & {
    value: number;
};

export const defaultMaxStringLengthValidatorOptions: DefaultMaxStringLengthValidatorOptionsType = {
    errorTemplate: '{{label}} is too long.',
    label: 'Value',
};

const validateMaxStringLength = (
    value: string,
    options: MaxStringLengthValidatorOptionsType,
): string => {
    const mergedOptions: MaxStringLengthValidatorOptionsType = {
        ...defaultMaxStringLengthValidatorOptions,
        ...options,
    };

    if (mergedOptions.value && value.length > mergedOptions.value) {
        return mergedOptions.errorTemplate!.replace(/\{\{label}}/g, mergedOptions.label!);
    }

    return '';
};

export default validateMaxStringLength;
