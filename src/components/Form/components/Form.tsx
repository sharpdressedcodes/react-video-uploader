import React, { memo } from 'react';
import classNames from 'classnames';
import { DefaultPropsType, PropsType } from '../types';
import '../styles/form.scss';

export const defaultProps: DefaultPropsType = {
    className: '',
    onSubmit: () => {},
    method: 'GET',
};

const Form = ({
    action,
    children,
    className = defaultProps.className,
    method = defaultProps.method,
    onSubmit = defaultProps.onSubmit,
}: PropsType) => (
    <form
        action={ action }
        className={ classNames('form', className) }
        method={ method }
        onSubmit={ onSubmit }
    >
        {children}
    </form>
);

Form.displayName = 'Form';

export default memo<PropsType>(Form);
