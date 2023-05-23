import React, { memo, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Toast from '../../components/Toast';
import Context from './Context';

const { defaultProps: defaultToastProps } = Toast.type;

const Provider = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [severity, setSeverity] = useState(defaultToastProps.severity);
    const [message, setMessage] = useState(null);
    const [autoHideDuration, setAutoHideDuration] = useState(defaultToastProps.autoHideDuration);
    const dismiss = () => new Promise(resolve => {
        setIsVisible(false);
        setMessage(null);
        setSeverity(defaultToastProps.severity);

        if (isVisible) {
            setTimeout(resolve, 0);
            return;
        }

        resolve();
    });
    const factory = (toastMessage, toastSeverity = defaultToastProps.severity, toastAutoHideDuration = defaultToastProps.autoHideDuration) => {
        (async () => {
            await dismiss();

            setSeverity(toastSeverity);
            setMessage(toastMessage);
            setAutoHideDuration(toastAutoHideDuration);
            setIsVisible(true);
        })();
    };
    const error = msg => factory(msg, 'error');
    const success = msg => factory(msg, 'success');
    const warning = msg => factory(msg, 'warning');
    const info = msg => factory(msg, 'info');
    const plain = msg => factory(msg);
    const value = useMemo(
        () => ({
            error,
            success,
            warning,
            info,
            plain,
            dismiss,
        }),
        [
            error,
            success,
            warning,
            info,
            plain,
            dismiss,
        ],
    );
    const onClosed = () => {
        setIsVisible(false);
    };

    return (
        <Context.Provider value={ value }>
            {isVisible && (
                <Toast autoHideDuration={ autoHideDuration } onClosed={ onClosed } severity={ severity }>
                    {message}
                </Toast>
            )}
            {children}
        </Context.Provider>
    );
};

Provider.displayName = 'ToastProvider';

Provider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default memo(Provider);
