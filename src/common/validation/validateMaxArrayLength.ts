import { CustomErrorTemplateValidatorType } from './customErrorTemplateValidator';

export type DefaultMaxArrayLengthValidatorOptionsType = CustomErrorTemplateValidatorType;

export type MaxArrayLengthValidatorOptionsType = Partial<DefaultMaxArrayLengthValidatorOptionsType> & {
    value: number;
};

export const defaultMaxArrayLengthValidatorOptions: DefaultMaxArrayLengthValidatorOptionsType = {
    errorTemplate: '{{label}} has too many items.',
    label: 'Value',
};

const validateMaxArrayLength = (
    value: any[],
    options: MaxArrayLengthValidatorOptionsType,
): string => {
    const mergedOptions: MaxArrayLengthValidatorOptionsType = {
        ...defaultMaxArrayLengthValidatorOptions,
        ...options,
    };

    if (mergedOptions.value && value.length > mergedOptions.value) {
        return mergedOptions.errorTemplate!.replace(/\{\{label}}/g, mergedOptions.label!);
    }

    return '';
};

export default validateMaxArrayLength;
