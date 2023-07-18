import React, { memo } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ConfigProvider } from '../../../context/Config';
import { ThemeProvider } from '../../../context/Theme';
import { ToastProvider } from '../../../context/Toast';
import { PropsType } from '../types';

const Providers = ({ children, store }: PropsType) => (
    <ReduxProvider store={ store }>
        <ConfigProvider>
            <ThemeProvider>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </ThemeProvider>
        </ConfigProvider>
    </ReduxProvider>
);

Providers.displayName = 'Providers';

export default memo<PropsType>(Providers);
