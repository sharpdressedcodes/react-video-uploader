import { ReactNode } from 'react';
import { AlertColor } from '@mui/material/Alert';

export type DefaultPropsType = {
    autoHideDuration?: number;
    className?: Nullable<string>;
    onClosed?: () => void;
    severity?: Nullable<AlertColor>;
}

export type PropsType = DefaultPropsType & {
    children: ReactNode;
}
