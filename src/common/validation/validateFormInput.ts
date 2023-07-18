import validateEmail from './validateEmail';
import validateMinStringLength from './validateMinStringLength';
import validateMaxStringLength from './validateMaxStringLength';
import validateRequiredString from './validateRequiredString';
import { isArrayEmpty } from '../index';

const validateFormInput = (
    value: string,
    rules: Nullable<Record<string, any>>,
): string[] => {
    const errors: string[] = [];

    if (rules!.required) {
        errors.push(validateRequiredString(value, rules!.required));
    }

    // Don't add this error if "required" error is present.
    if (isArrayEmpty(errors.filter(Boolean)) && rules!.minLength) {
        errors.push(validateMinStringLength(value, rules!.minLength));
    }

    if (rules!.maxLength) {
        errors.push(validateMaxStringLength(value, rules!.maxLength));
    }

    if (rules!.email) {
        errors.push(validateEmail(value, rules!.email));
    }

    return errors.filter(Boolean);
};

export default validateFormInput;
