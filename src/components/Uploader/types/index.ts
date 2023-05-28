import { AxiosProgressEvent, AxiosRequestConfig } from 'axios';

export type UploadStepType = {
    step: number;
    total: number;
    status: string;
}

export type UploadFileStepType = UploadStepType & {
    index: number;
    file: File | Express.Multer.File;
}

export type UploadProgressStepType = UploadFileStepType & {
    percent: number;
}

export type DefaultApiUploadPropsType = {
    onProgress?: (event: AxiosProgressEvent) => void;
    options?: AxiosRequestConfig;
}

export type ApiUploadPropsType = DefaultApiUploadPropsType & {
    url: string;
    data: any;
}

export type StateType = {
    selectedFiles: Nullable<File[]>;
    loaded: number;
    uploading: boolean;
    uploadedFiles: Array<UploadFileStepType | UploadProgressStepType>;
}

export type DefaultPropsType = {
    allowedFileExtensions?: string[];
    className?: string;
    maxFiles?: number;
    maxFileSize?: number;
    maxTotalFileSize?: number;
    multiple?: boolean;
    progress?: boolean;
}

export type PropsType = DefaultPropsType & {
    url: string;
}
