import React, { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './stores/app';
import reportWebVitals from './reporting/WebVitals';
import config from './config';
import { App } from './components';

(() => {
    window.boot = () => {
        (async () => {
            const isProduction = process.env.NODE_ENV === 'production';

            try {
                const { reactPreloadedState: state, reactInitialData: data } = window;
                const store = configureStore(state);
                const jsx = (
                    <StrictMode>
                        <Provider store={ store }>
                            <BrowserRouter>
                                <App data={ data } />
                            </BrowserRouter>
                        </Provider>
                    </StrictMode>
                );

                delete window.reactPreloadedState;
                delete window.reactInitialData;

                if (!window.reactRoot) {
                    const root = document.getElementById('app');

                    // We use createRoot instead of hydrateRoot during HMR, otherwise we get mismatch warnings
                    if (import.meta.webpackHot) {
                        window.reactRoot = createRoot(root);
                        window.reactRoot.render(jsx);
                    } else {
                        window.reactRoot = hydrateRoot(root, jsx);
                    }
                } else {
                    window.reactRoot.render(jsx);
                }
            } catch (err) {
                if (!isProduction) {
                    // eslint-disable-next-line no-console
                    console.log(`Client bootstrap error: ${err.message}`);
                }
            }
        })();
    };

    if (window.loaded) {
        window.boot();

        if (config.get('webVitals.enabled')) {
            reportWebVitals(config.get('webVitals.callback', null));
        }
    }
})();
