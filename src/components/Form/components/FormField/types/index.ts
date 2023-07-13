import { ReactNode } from 'react';

export enum FieldElements {
    label,
    help,
    element,
    error,
}

export type DefaultPropsType = {
    className: string;
};

export type PropsType = Partial<DefaultPropsType> & {
    children: ReactNode;
};
