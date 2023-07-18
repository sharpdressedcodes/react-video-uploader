import { ReactNode } from 'react';

export type DefaultPropsType = {
    children?: ReactNode;
    className?: string;
    closeOnClick?: boolean;
    onClosed?: () => void;
};

export type PropsType = DefaultPropsType;
