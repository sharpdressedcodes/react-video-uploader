import React, { memo } from 'react';
import { classNames } from '../../../../../../../common';
import { DefaultPropsType, PropsType } from '../types';
import '../styles/form-field-help.scss';

export const defaultProps: DefaultPropsType = {
    className: '',
    id: '',
};

const FormFieldHelp = ({
    children,
    className = defaultProps.className,
    id = defaultProps.id,
}: PropsType) => (
    <div id={ id } className={ classNames('form-field-help', className) }>
        {children}
    </div>
);

FormFieldHelp.displayName = 'FormFieldHelp';

export default memo<PropsType>(FormFieldHelp);
