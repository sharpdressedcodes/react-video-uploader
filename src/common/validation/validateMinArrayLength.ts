import { CustomErrorTemplateValidatorType } from './customErrorTemplateValidator';

export type DefaultMinArrayLengthValidatorOptionsType = CustomErrorTemplateValidatorType;

export type MinArrayLengthValidatorOptionsType = Partial<DefaultMinArrayLengthValidatorOptionsType> & {
    value: number;
};

export const defaultMinArrayLengthValidatorOptions: DefaultMinArrayLengthValidatorOptionsType = {
    errorTemplate: "{{label}} doesn't have enough items.",
    label: 'Value',
};

const validateMinArrayLength = (
    value: any[],
    options: MinArrayLengthValidatorOptionsType,
): string => {
    const mergedOptions: MinArrayLengthValidatorOptionsType = {
        ...defaultMinArrayLengthValidatorOptions,
        ...options,
    };

    if (mergedOptions.value && value.length < mergedOptions.value) {
        return mergedOptions.errorTemplate!.replace(/\{\{label}}/g, mergedOptions.label!);
    }

    return '';
};

export default validateMinArrayLength;
