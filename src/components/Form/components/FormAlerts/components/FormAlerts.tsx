import React, { memo, ReactNode } from 'react';
import Alert, { AlertColor } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { classNames, isArrayEmpty } from '../../../../../common';
import { DefaultPropsType, PropsType } from '../types';
import '../styles/form-alerts.scss';

export const defaultProps: DefaultPropsType = {
    className: '',
    errorMessages: [],
    infoMessages: [],
    successMessages: [],
    warningMessages: [],
};

const renderMessages = (messages: ReactNode[], severity: AlertColor) => {
    if (isArrayEmpty(messages)) {
        return null;
    }

    return (
        <Alert severity={ severity } key={ severity }>
            <AlertTitle>{`${severity.substring(0, 1).toUpperCase()}${severity.substring(1)}`}</AlertTitle>
            {messages}
        </Alert>
    );
};

const FormAlerts = ({
    className = defaultProps.className,
    errorMessages = defaultProps.errorMessages,
    infoMessages = defaultProps.infoMessages,
    successMessages = defaultProps.successMessages,
    warningMessages = defaultProps.warningMessages,
}: PropsType) => {
    const renderedErrorMessages = renderMessages(errorMessages, 'error');
    const renderedInfoMessages = renderMessages(infoMessages, 'info');
    const renderedSuccessMessages = renderMessages(successMessages, 'success');
    const renderedWarningMessages = renderMessages(warningMessages, 'warning');

    if (!renderedErrorMessages && !renderedInfoMessages && !renderedSuccessMessages && !renderedWarningMessages) {
        return null;
    }

    return (
        <section className={ classNames('form-alerts', className) }>
            {renderedErrorMessages}
            {renderedWarningMessages}
            {renderedInfoMessages}
            {renderedSuccessMessages}
        </section>
    );
};

FormAlerts.displayName = 'FormAlerts';

export default memo<PropsType>(FormAlerts);
