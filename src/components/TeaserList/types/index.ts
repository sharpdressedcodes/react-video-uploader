import { ReactNode } from 'react';

export type DefaultPropsType = {
    className?: string;
};

export type PropsType = DefaultPropsType & {
    children: ReactNode;
};
