import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Provider as ReduxProvider } from 'react-redux';
import { ConfigProvider } from '../../../context/Config';
import { ThemeProvider } from '../../../context/Theme';
import { ToastProvider } from '../../../context/Toast';

const Providers = ({ children, store }) => (
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

Providers.propTypes = {
    children: PropTypes.node.isRequired,
    store: PropTypes.object.isRequired,
};

export default memo(Providers);
