import { CustomErrorTemplateValidatorType } from './customErrorTemplateValidator';

export type DefaultRegExpValidatorOptionsType = CustomErrorTemplateValidatorType;

export type RegExpValidatorOptionsType = Partial<DefaultRegExpValidatorOptionsType> & {
    value: RegExp;
};

export const defaultRegExpValidatorOptions: DefaultRegExpValidatorOptionsType = {
    errorTemplate: '{{label}} is invalid.',
    label: 'Value',
};

const validateRegExp = (
    value: string,
    options: RegExpValidatorOptionsType,
): string => {
    const mergedOptions: RegExpValidatorOptionsType = {
        ...defaultRegExpValidatorOptions,
        ...options,
    };

    if (mergedOptions.value && !mergedOptions.value.test(value)) {
        return mergedOptions.errorTemplate!.replace(/\{\{label}}/g, mergedOptions.label!);
    }

    return '';
};

export default validateRegExp;
