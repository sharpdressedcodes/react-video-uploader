import React, { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
import BrowserRouter from './components/BrowserRouter';
import Providers from './components/Providers';
import App from './components/App';
import configureStore from './stores/app';
import reportWebVitals from './reporting/WebVitals';
import config from './config';

(() => {
    window.boot = () => {
        (async () => {
            const isProduction = process.env.NODE_ENV === 'production';

            try {
                const { reactPreloadedState: state, reactInitialData: data } = window;
                const store = configureStore(state);
                const jsx = (
                    <BrowserRouter>
                        <StrictMode>
                            <Providers store={ store }>
                                <App data={ data } />
                            </Providers>
                        </StrictMode>
                    </BrowserRouter>
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

                if (config.get('serviceWorker.enabled')) {
                    const serviceWorkerRegistration = await import(/* webpackChunkName: "service-worker" */ './workers/service/serviceWorkerRegistration');

                    // If you want your app to work offline and load faster, you can change
                    // unregister() to register() below. Note this comes with some pitfalls.
                    // Learn more about service workers: https://cra.link/PWA
                    serviceWorkerRegistration.unregister();
                }

                if (config.get('webVitals.enabled')) {
                    reportWebVitals(config.get('webVitals.callback', null));
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
    }
})();
