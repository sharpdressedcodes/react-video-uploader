import { ReactNode } from 'react';
import { AlertColor } from '@mui/material/Alert';

export type AlertMessageType = {
    severity: AlertColor;
    message: ReactNode;
};

export type DefaultPropsType = {
    className: string;
    htmlFor: string;
    id: string;
    showIcon: boolean;
};

export type PropsType = Partial<DefaultPropsType> & {
    messages: AlertMessageType[];
};
