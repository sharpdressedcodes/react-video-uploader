import { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import { AlertColor } from '@mui/material/Alert';
import { BaseFormWithProgressStateType } from '../../../Form';

export type DefaultSubmitContactFormPropsType = {
    onProgress?: (event: AxiosProgressEvent) => void;
    options?: AxiosRequestConfig;
};

export type SubmitContactFormPropsType = DefaultSubmitContactFormPropsType & {
    url: string;
    data: any;
};

export type AlertType = {
    severity: AlertColor;
    message: string;
};

export type SelectedFileType = {
    file: File;
    alerts: Nullable<AlertType[]>;
};

export type StateType = {
    files: Nullable<SelectedFileType[]>;
};

export type FormStateType = BaseFormWithProgressStateType & {
    email: string;
    message: string;
    files: File[],
};
