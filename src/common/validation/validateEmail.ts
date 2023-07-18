import { CustomErrorTemplateValidatorType } from './customErrorTemplateValidator';
import validateMaxStringLength from './validateMaxStringLength';
import validateMinStringLength from './validateMinStringLength';
import validateRegExp from './validateRegExp';

export type DefaultEmailValidatorOptionsType = CustomErrorTemplateValidatorType;

export type EmailValidatorOptionsType = Partial<DefaultEmailValidatorOptionsType>;

export const defaultEmailValidatorOptions: DefaultEmailValidatorOptionsType = {
    errorTemplate: '{{label}} is not a valid email address.',
    label: 'Value',
};

export const minEmailLength = 5;
// https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
// 64 + 1 "@" + 254 = 319
export const maxEmailLength = 319;

const validateEmail = (
    value: string,
    options: EmailValidatorOptionsType,
): string => {
    const mergedOptions: EmailValidatorOptionsType = {
        ...defaultEmailValidatorOptions,
        ...options,
    };
    let error = validateMinStringLength(value, { value: minEmailLength });

    if (error) {
        return error;
    }

    error = validateMaxStringLength(value, { value: maxEmailLength });

    if (error) {
        return error;
    }

    return validateRegExp(value, {
        errorTemplate: mergedOptions.errorTemplate,
        label: mergedOptions.label,
        value: /^(.*){1,64}@((.*){1,}\.(.*){1,}){1,254}$/,
    });
};

export default validateEmail;
