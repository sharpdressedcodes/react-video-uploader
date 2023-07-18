import React, { Fragment, memo } from 'react';
import { DefaultPropsType, PropsType } from '../types';
import { FieldElements } from '../../..';

export const defaultProps: DefaultPropsType = {
    order: [
        FieldElements.label,
        FieldElements.help,
        FieldElements.element,
        FieldElements.error,
    ],
    label: null,
    help: null,
    error: null,
};

const FormFieldRenderer = ({
    element,
    error = defaultProps.error,
    help = defaultProps.help,
    label = defaultProps.label,
    order = defaultProps.order,
}: PropsType) => order.map(item => {
    switch (item) {
        case FieldElements.label:
            return <Fragment key="label">{label}</Fragment>;
        case FieldElements.help:
            return <Fragment key="help">{help}</Fragment>;
        case FieldElements.element:
            return <Fragment key="element">{element}</Fragment>;
        case FieldElements.error:
            return <Fragment key="error">{error}</Fragment>;
        default:
            return null;
    }
});

FormFieldRenderer.displayName = 'FormFieldRenderer';

export default memo<PropsType>(FormFieldRenderer);
