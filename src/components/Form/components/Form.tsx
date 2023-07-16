import React, { memo } from 'react';
import { classNames } from '../../../common';
import { DefaultPropsType, PropsType } from '../types';
import '../styles/form.scss';

export const defaultProps: DefaultPropsType = {
    autoComplete: '',
    className: '',
    encType: 'application/x-www-form-urlencoded',
    method: 'GET',
    onSubmit: () => {},
};

const Form = ({
    action,
    autoComplete = defaultProps.autoComplete,
    children,
    className = defaultProps.className,
    encType = defaultProps.encType,
    method = defaultProps.method,
    onSubmit = defaultProps.onSubmit,
}: PropsType) => (
    <form
        action={ action }
        autoComplete={ autoComplete }
        className={ classNames('form', className) }
        encType={ encType }
        method={ method }
        onSubmit={ onSubmit }
    >
        {children}
    </form>
);

Form.displayName = 'Form';

export default memo<PropsType>(Form);
