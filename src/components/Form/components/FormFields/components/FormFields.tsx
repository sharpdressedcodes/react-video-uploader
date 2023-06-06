import React, { memo } from 'react';
import classNames from 'classnames';
import { DefaultPropsType, PropsType } from '../types';
import '../styles/form-fields.scss';

export const defaultProps: DefaultPropsType = {
    className: '',
};

const FormFields = ({
    children,
    className = defaultProps.className,
}: PropsType) => (
    <div className={ classNames('form-fields', className) }>
        {children}
    </div>
);

FormFields.displayName = 'FormFields';

export default memo<PropsType>(FormFields);
