import { ReactNode } from 'react';

export type DefaultPropsType = {
    className: string;
};

export type PropsType = Partial<DefaultPropsType> & {
    children: ReactNode;
};
