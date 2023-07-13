import { FormEventHandler, ReactNode } from 'react';

export type DefaultComponentConfigType = {
    helpMessage: string;
    placeholder: string;
    rules: Nullable<Record<string, any>>;
};

export type ComponentConfigType = Partial<DefaultComponentConfigType> & {
    label: string;
    id: string;
};

export type BaseFormMessageDataType = string[] | Record<string, string[]>;
export type BaseFormMessageType = Record<string, BaseFormMessageDataType>;

export type BaseFormStateType = {
    hasSubmit: boolean;
    isSubmitting: boolean;
    errorMessages: Nullable<BaseFormMessageType>;
    infoMessages: Nullable<BaseFormMessageType>;
    successMessages: Nullable<BaseFormMessageType>;
    warningMessages: Nullable<BaseFormMessageType>;
};

export type BaseFormWithProgressStateType = BaseFormStateType & {
    progressPercentage: number;
};

export type AllowedFormMethods = 'DIALOG' | 'GET' | 'POST';
export type AllowedEncTypes = 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';

export type DefaultPropsType = {
    autoComplete: string;
    className: string;
    onSubmit: FormEventHandler<HTMLFormElement> | undefined;
    // method: FormHTMLAttributes<HTMLFormElement>['method'];
    method: AllowedFormMethods;
    // encType: FormHTMLAttributes<HTMLFormElement>['encType'];
    encType: AllowedEncTypes;
};

export type PropsType = Partial<DefaultPropsType> & {
    children: ReactNode;
    action: string;
};
