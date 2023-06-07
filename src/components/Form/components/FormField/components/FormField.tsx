import React, { memo } from 'react';
import { classNames } from '../../../../../common';
import { DefaultPropsType, PropsType } from '../types';
import '../styles/form-field.scss';

export const defaultProps: DefaultPropsType = {
    className: '',
};

const FormField = ({
    children,
    className = defaultProps.className,
}: PropsType) => (
    <div className={ classNames('form-field', className) }>
        {children}
    </div>
);

FormField.displayName = 'FormField';

export default memo<PropsType>(FormField);
