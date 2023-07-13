import React, { memo } from 'react';
import { classNames } from '../../../common';
import {
    BaseFormStateType,
    BaseFormWithProgressStateType,
    DefaultComponentConfigType,
    DefaultPropsType,
    PropsType,
} from '../types';
import '../styles/form.scss';

export const defaultComponentConfig: DefaultComponentConfigType = {
    helpMessage: '',
    placeholder: '',
    rules: null,
};

export const defaultBaseFormState: BaseFormStateType = {
    hasSubmit: false,
    isSubmitting: false,
    errorMessages: null,
    infoMessages: null,
    successMessages: null,
    warningMessages: null,
};

export const defaultBaseFormWithProgressState: BaseFormWithProgressStateType = {
    ...defaultBaseFormState,
    progressPercentage: 0,
};

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
