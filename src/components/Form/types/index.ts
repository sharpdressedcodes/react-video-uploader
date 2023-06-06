import { FormEventHandler, ReactNode } from 'react';

export type DefaultPropsType = {
    className: string;
    onSubmit: FormEventHandler<HTMLFormElement> | undefined;
    method: string;
};

export type PropsType = Partial<DefaultPropsType> & {
    children: ReactNode;
    action: string;
};
