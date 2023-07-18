export type DefaultPropsType = {
    allowedFileExtensions: string[];
    className: string;
    maxFiles: number;
    maxFileSize: number;
    maxTotalFileSize: number;
};

export type PropsType = Partial<DefaultPropsType>;
