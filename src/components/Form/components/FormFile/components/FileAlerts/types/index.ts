import { AlertColor } from '@mui/material/Alert';

export type AlertType = {
    severity: AlertColor;
    message: string;
};

export type DefaultFileAlertsPropsType = {
    text: string;
};

export type FileAlertsPropsType = Partial<DefaultFileAlertsPropsType> & {
    alerts: Nullable<AlertType[]>;
};

export type StateType = {
    popoverAnchor: Nullable<HTMLButtonElement>;
};
