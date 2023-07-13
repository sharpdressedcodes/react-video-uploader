import React, { memo } from 'react';
import { classNames } from '../../../../../common';
import { DefaultPropsType, PropsType } from '../types';
import '../styles/form-label.scss';

export const defaultProps: DefaultPropsType = {
    className: '',
    htmlFor: '',
    id: '',
    required: false,
};

const FormLabel = ({
    children,
    className = defaultProps.className,
    htmlFor = defaultProps.htmlFor,
    id = defaultProps.id,
    required = defaultProps.required,
}: PropsType) => (
    <label
        id={ id }
        className={ classNames('form-label', className) }
        htmlFor={ htmlFor }
    >
        {children}
        {required && <span className="form-required">*</span>}
    </label>
);

FormLabel.displayName = 'FormLabel';

export default memo<PropsType>(FormLabel);
