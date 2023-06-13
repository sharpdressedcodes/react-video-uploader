import { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import { FileValidationValidationType } from '../../../../common/validation/fileValidation';
import { LoadedVideoType } from '../../../../state/types';
import { ConvertFileStepType, ConvertProgressStepType } from '../../../../server/types';

export type DefaultSubmitUploadFormPropsType = {
    onProgress?: (event: AxiosProgressEvent) => void;
    options?: AxiosRequestConfig;
};

export type SubmitUploadFormPropsType = DefaultSubmitUploadFormPropsType & {
    url: string;
    data: any;
};

export type DependenciesType = {
    validation: FileValidationValidationType;
    error: string;
    result: LoadedVideoType;
};

export type StateType = {
    selectedFiles: Nullable<File[]>;
    loaded: number;
    uploading: boolean;
    uploadedFiles: Array<ConvertFileStepType | ConvertProgressStepType>;
    validation: Nullable<FileValidationValidationType>;
};
