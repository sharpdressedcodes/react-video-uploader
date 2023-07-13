import { ReactNode } from 'react';
import { FieldElements } from '../../..';

export type DefaultPropsType = {
    order: FieldElements[],
    label: ReactNode;
    help: ReactNode;
    error: ReactNode;
};

export type PropsType = Partial<DefaultPropsType> & {
    element: ReactNode;
};
