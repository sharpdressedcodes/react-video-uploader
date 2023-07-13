import { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import { AlertColor } from '@mui/material/Alert';
import { ConvertFileStepType, ConvertProgressStepType } from '../../../../server/types';
import { BaseFormWithProgressStateType } from '../../../Form';

export type DefaultSubmitUploadFormPropsType = {
    onProgress?: (event: AxiosProgressEvent) => void;
    options?: AxiosRequestConfig;
};

export type SubmitUploadFormPropsType = DefaultSubmitUploadFormPropsType & {
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
    convertStep: Nullable<ConvertFileStepType>;
    convertProgress: Nullable<ConvertProgressStepType>;
};

export type StateType = {
    files: Nullable<SelectedFileType[]>;
};

export type FormStateType = BaseFormWithProgressStateType & {
    file: File[],
};
