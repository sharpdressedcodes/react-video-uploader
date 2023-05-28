import { ErrorInfo, ReactNode } from 'react';

export type DefaultPropsType = {
    onComponentDidCatch?: (error: Error, errorInfo: ErrorInfo) => void;
    errorMessage?: ReactNode;
}

export type PropsType = DefaultPropsType & {
    children: ReactNode;
}

export type StatesType = {
    hasError: boolean;
}
