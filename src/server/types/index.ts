import { Express } from 'express';

export type UploadStepType = {
    step: number;
    total: number;
    status: string;
};

export type UploadFileStepType = UploadStepType & {
    index: number;
    file: File | Express.Multer.File;
};

export type UploadProgressStepType = UploadFileStepType & {
    percent: number;
};
