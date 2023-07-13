import { ChangeEvent, ReactNode, RefObject } from 'react';
import { FieldElements } from '../../FormField';
import { AlertMessageType } from '../../FormField/components/FormFieldAlerts';

export type SingleAndMultipleTextType = {
    single: string;
    multiple: string;
};

export type DefaultPropsType = {
    alertMessages: Nullable<AlertMessageType[]>;
    allowedFileExtensions: string[];
    componentRef: Nullable<RefObject<Nullable<HTMLInputElement>>>;
    className: string;
    disabled: boolean;
    elementOrder: FieldElements[];
    helpMessage: ReactNode;
    label: ReactNode;
    maxFiles: number;
    maxFileSize: number;
    maxTotalFileSize: number;
    multiple: boolean;
    name: string;
    required: boolean;
    buttonText: SingleAndMultipleTextType
    buttonSelectedText: SingleAndMultipleTextType
    dropZoneText: SingleAndMultipleTextType
    dropZoneDraggingText: SingleAndMultipleTextType
    showRestrictions: boolean;
    useDragAndDrop: boolean;
    onChange: (files: Nullable<File[]>, event?: ChangeEvent<HTMLInputElement>) => MaybePromiseType<void>;
};

export type PropsType = Partial<DefaultPropsType> & {
    id: string;
};
