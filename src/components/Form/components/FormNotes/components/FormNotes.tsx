import React, { memo } from 'react';
import { classNames } from '../../../../../common';
import { DefaultPropsType, PropsType } from '../types';
import '../styles/form-notes.scss';

export const defaultProps: DefaultPropsType = {
    className: '',
};

const FormNotes = ({
    children,
    className = defaultProps.className,
}: PropsType) => (
    <section className={ classNames('form-notes', className) }>
        {children}
    </section>
);

FormNotes.displayName = 'FormNotes';

export default memo<PropsType>(FormNotes);
