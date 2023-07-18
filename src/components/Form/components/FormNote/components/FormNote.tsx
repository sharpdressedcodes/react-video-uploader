import React, { memo } from 'react';
import { classNames } from '../../../../../common';
import { DefaultPropsType, PropsType } from '../types';
import '../styles/form-note.scss';

export const defaultProps: DefaultPropsType = {
    className: '',
};

const FormNote = ({
    children,
    className = defaultProps.className,
}: PropsType) => (
    <div className={ classNames('form-note', className) }>
        {children}
    </div>
);

FormNote.displayName = 'FormNote';

export default memo<PropsType>(FormNote);
