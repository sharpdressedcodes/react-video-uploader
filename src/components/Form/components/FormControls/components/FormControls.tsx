import React, { memo } from 'react';
import classNames from 'classnames';
import { DefaultPropsType, PropsType } from '../types';
import '../styles/form-controls.scss';

export const defaultProps: DefaultPropsType = {
    className: '',
};

const FormControls = ({
    children,
    className = defaultProps.className,
}: PropsType) => (
    <div className={ classNames('form-controls', className) }>
        {children}
    </div>
);

FormControls.displayName = 'FormControls';

export default memo<PropsType>(FormControls);
