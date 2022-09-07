import React, { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './stores/app';
import { App } from './components';

/* eslint-disable no-underscore-dangle */
const root = document.getElementById('app');
const { __PRELOADED_STATE__: state, __INITIAL_DATA__: data } = window;
const store = configureStore(state);

delete window.__PRELOADED_STATE__;
delete window.__INITIAL_DATA__;
/* eslint-enable no-underscore-dangle */

hydrateRoot(
    root,
    <StrictMode>
        <Provider store={ store }>
            <BrowserRouter>
                <App data={ data } />
            </BrowserRouter>
        </Provider>
    </StrictMode>
);
