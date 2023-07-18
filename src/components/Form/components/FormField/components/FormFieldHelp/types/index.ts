import { ReactNode } from 'react';

export type DefaultPropsType = {
    className: string;
    id: string;
};

export type PropsType = Partial<DefaultPropsType> & {
    children: ReactNode;
};
