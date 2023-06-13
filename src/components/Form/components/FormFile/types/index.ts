export type SingleAndMultipleTextType = Partial<{
    single: string;
    multiple: string;
}>;

export type DefaultPropsType = {
    allowedFileExtensions: string[];
    className: string;
    enabled: boolean;
    id: string;
    maxFiles: number;
    maxFileSize: number;
    maxTotalFileSize: number;
    multiple: boolean;
    name: string;
    buttonText: SingleAndMultipleTextType
    buttonSelectedText: SingleAndMultipleTextType
    dropZoneText: SingleAndMultipleTextType
    dropZoneDraggingText: SingleAndMultipleTextType
    showRestrictions: boolean;
    useDragAndDrop: boolean;
    onChange: (files: Nullable<File[]>) => MaybePromiseType<void>;
    onValidate: (files: File[]) => MaybePromiseType<File[]>;
};

export type PropsType = Partial<DefaultPropsType>;
