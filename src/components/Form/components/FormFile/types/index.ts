// import { ChangeEventHandler } from 'react';

export type DefaultPropsType = {
    allowedFileExtensions: string[];
    className: string;
    enabled: boolean;
    id: string;
    multiple: boolean;
    name: string;
    // onChange: ChangeEventHandler<HTMLInputElement> | undefined;
    onChange: (files: Nullable<File[]>) => MaybePromiseType<void>;
    onValidate: (files: File[]) => MaybePromiseType<File[]>;
};

export type PropsType = Partial<DefaultPropsType>;
