import React, { memo, ReactNode, useMemo, useState } from 'react';
import Toast, { defaultProps as defaultToastProps, PropsType as ToastPropsType } from '../../components/Toast';
import Context, { ToastContextType } from './Context';

type PropsType = {
    children: ReactNode;
}

const Provider = ({ children }: PropsType) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [severity, setSeverity] = useState<ToastPropsType['severity']>(defaultToastProps.severity);
    const [message, setMessage] = useState<ReactNode>(<></>);
    const [autoHideDuration, setAutoHideDuration] = useState<ToastPropsType['autoHideDuration']>(defaultToastProps.autoHideDuration);
    const dismiss = () => new Promise<void>(resolve => {
        setIsVisible(false);
        setMessage(null);
        setSeverity(defaultToastProps.severity);

        if (isVisible) {
            setTimeout(resolve, 0);
            return;
        }

        resolve();
    });
    const factory = (
        toastMessage: ReactNode,
        toastSeverity: ToastPropsType['severity'] = defaultToastProps.severity,
        toastAutoHideDuration = defaultToastProps.autoHideDuration,
    ) => {
        (async () => {
            await dismiss();

            setSeverity(toastSeverity);
            setMessage(toastMessage);
            setAutoHideDuration(toastAutoHideDuration);
            setIsVisible(true);
        })();
    };
    const error = (msg: ReactNode) => factory(msg, 'error');
    const success = (msg: ReactNode) => factory(msg, 'success');
    const warning = (msg: ReactNode) => factory(msg, 'warning');
    const info = (msg: ReactNode) => factory(msg, 'info');
    const plain = (msg: ReactNode) => factory(msg);
    const value = useMemo(
        () => ({
            error,
            success,
            warning,
            info,
            plain,
            dismiss,
        } as ToastContextType),
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
            {isVisible && message && (
                <Toast autoHideDuration={ autoHideDuration } onClosed={ onClosed } severity={ severity }>
                    {message}
                </Toast>
            )}
            {children}
        </Context.Provider>
    );
};

Provider.displayName = 'ToastProvider';

export default memo<PropsType>(Provider);
