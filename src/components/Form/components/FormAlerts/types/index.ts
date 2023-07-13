import { ReactNode } from 'react';

export type DefaultPropsType = {
    className: string;
    errorMessages: ReactNode[];
    infoMessages: ReactNode[];
    successMessages: ReactNode[];
    warningMessages: ReactNode[];
};

export type PropsType = Partial<DefaultPropsType>;
