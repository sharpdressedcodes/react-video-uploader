import { FormEventHandler, ReactNode } from 'react';

export type AllowedFormMethods = 'DIALOG' | 'GET' | 'POST';

export type DefaultPropsType = {
    className: string;
    onSubmit: FormEventHandler<HTMLFormElement> | undefined;
    // method: FormHTMLAttributes<HTMLFormElement>['method'];
    method: AllowedFormMethods;
};

export type PropsType = Partial<DefaultPropsType> & {
    children: ReactNode;
    action: string;
};
