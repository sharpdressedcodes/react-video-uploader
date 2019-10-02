import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from '../shared/app';
import configureStore from '../stores/app';

const root = document.getElementById('app');
/* eslint-disable no-underscore-dangle */
const state = window.__PRELOADED_STATE__;
const data = window.__INITIAL_DATA__;
// delete window.__PRELOADED_STATE__;
// delete window.__INITIAL_DATA__;
/* eslint-enable no-underscore-dangle */
const store = configureStore(state);

hydrate(
    <Provider store={store}>
        <BrowserRouter>
            <App data={data} />
        </BrowserRouter>
    </Provider>,
    root,
    () => {
        root.style.opacity = 1;
    },
);
