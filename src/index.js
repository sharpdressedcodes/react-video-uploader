import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
// import config from 'react-global-configuration';
import App from './shared/app';
import configureStore from './stores/app';

const root = document.getElementById('app');
/* eslint-disable no-underscore-dangle */
const state = window.__PRELOADED_STATE__;
// const appConfig = window.__INITIAL_CONFIG__;
const data = window.__INITIAL_DATA__;
// delete window.__PRELOADED_STATE__;
// delete window.__INITIAL_DATA__;
// delete window.__INITIAL_CONFIG__;
/* eslint-enable no-underscore-dangle */
const store = configureStore(state);
// const store = configureStore(state);

// config.set(appConfig, { freeze: false });

hydrateRoot(
    root,
    <Provider store={store}>
        <BrowserRouter>
            <App data={data} />
        </BrowserRouter>
    </Provider>
);
// hydrateRoot(
//     root,
//     <Provider store={store}><App data={data} /></Provider>
// );
