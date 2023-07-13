import { FocusEvent, ChangeEvent, ReactNode, RefObject } from 'react';
import { FieldElements } from '../../FormField';
import { AlertMessageType } from '../../FormField/components/FormFieldAlerts';

export type InputTypesType = 'email' | 'password' | 'tel' | 'text' | 'textarea' | 'url';
export type TextAreaResizeType = 'none' | 'horizontal' | 'vertical' | 'both';

export type DefaultPropsType = {
    alertMessages: Nullable<AlertMessageType[]>;
    autoComplete: string;
    autoFocus: boolean;
    componentRef: Nullable<RefObject<Nullable<HTMLInputElement | HTMLTextAreaElement>>>;
    className: string;
    disabled: boolean;
    elementOrder: FieldElements[];
    helpMessage: ReactNode;
    label: ReactNode;
    maxLength: number;
    name: string;
    placeholder: string;
    resize: TextAreaResizeType;
    required: boolean;
    rows: number;
    showPasswordToggle: boolean;
    type: InputTypesType
    value: string;
    onBlur: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onChange: (value: string, event?: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export type PropsType = Partial<DefaultPropsType> & {
    id: string;
};

export type StateType = {
    isPasswordVisible: boolean;
    isTabbingBackwards: boolean;
    isMouseOver: boolean;
    hasFocus: boolean;
};
