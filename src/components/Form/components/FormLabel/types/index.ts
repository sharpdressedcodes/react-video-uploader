import { ReactNode } from 'react';

export type DefaultPropsType = {
    className: string;
    htmlFor: string;
    id: string;
    required: boolean;
};

export type PropsType = Partial<DefaultPropsType> & {
    children: ReactNode;
};
