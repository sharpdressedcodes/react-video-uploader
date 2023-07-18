import React, { memo } from 'react';
import { classNames } from '../../../../../common';
import { DefaultPropsType, PropsType } from '../types';
import '../styles/form-alert.scss';

export const defaultProps: DefaultPropsType = {
    className: '',
};

const FormAlert = ({
    children,
    className = defaultProps.className,
}: PropsType) => (
    <div className={ classNames('form-error', className) }>
        {children}
    </div>
);

FormAlert.displayName = 'FormAlert';

export default memo<PropsType>(FormAlert);
