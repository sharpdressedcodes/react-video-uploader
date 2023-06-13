import { Express } from 'express';

export type CreateStepType = {
    step: number;
    total: number;
    status: string;
};

export type ConvertFileStepType = CreateStepType & {
    index: number;
    file: File | Express.Multer.File;
};

export type ConvertProgressStepType = ConvertFileStepType & {
    percent: number;
};
