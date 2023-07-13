import React, { memo } from 'react';
import { classNames } from '../../../../../../../common';
import { ReactComponent as ErrorSvg } from '../../../../../../../assets/icons/error.svg';
import { ReactComponent as InfoSvg } from '../../../../../../../assets/icons/info.svg';
import { ReactComponent as SuccessSvg } from '../../../../../../../assets/icons/success.svg';
import { ReactComponent as WarningSvg } from '../../../../../../../assets/icons/warning.svg';
import { AlertMessageType, DefaultPropsType, PropsType } from '../types';
import '../styles/form-field-alerts.scss';

export const defaultProps: DefaultPropsType = {
    className: '',
    htmlFor: '',
    id: '',
    showIcon: true,
};

const FormFieldAlerts = ({
    className = defaultProps.className,
    htmlFor = defaultProps.htmlFor,
    id = defaultProps.id,
    messages,
    showIcon = defaultProps.showIcon,
}: PropsType) => {
    const renderIcon = (item: AlertMessageType) => {
        switch (item.severity) {
            case 'error':
                return <ErrorSvg />;
            case 'info':
                return <InfoSvg />;
            case 'success':
                return <SuccessSvg />;
            case 'warning':
                return <WarningSvg />;
            default:
                return null;
        }
    };
    const renderItem = (item: AlertMessageType, index: number) => {
        const cls = 'form-field-alerts__alert';
        const modifiers = {
            [`${cls}--error`]: item.severity === 'error',
            [`${cls}--info`]: item.severity === 'info',
            [`${cls}--success`]: item.severity === 'success',
            [`${cls}--warning`]: item.severity === 'warning',

        };

        return (
            <div
                className={ classNames(cls, modifiers) }
                key={ JSON.stringify(item.message) }
            >
                <label
                    htmlFor={ htmlFor }
                    id={ `${id}-${index}` }
                >
                    {showIcon && (
                        <span className={ `${cls}-icon` }>
                            {renderIcon(item)}
                        </span>
                    )}
                    {item.message}
                </label>
            </div>
        );
    };

    return (
        <div className={ classNames('form-field-alerts', className) } id={ id }>
            {messages.map(renderItem)}
        </div>
    );
};

FormFieldAlerts.displayName = 'FormFieldAlerts';

export default memo<PropsType>(FormFieldAlerts);
