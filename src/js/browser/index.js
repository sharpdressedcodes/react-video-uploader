import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from '../shared/app';
import { configureStore } from '../stores/app';

const root = document.getElementById('app');
const preloadedState = window.__PRELOADED_STATE__;
const preloadedData = window.__INITIAL_DATA__;
//delete window.__PRELOADED_STATE__;
//delete window.__INITIAL_DATA__;
// console.log('preloadedState', preloadedState);
// console.log('preloadedData', preloadedData);
// console.log('window.__PRELOADED_STATE__', window.__PRELOADED_STATE__);
// console.log('window.__INITIAL_DATA__', window.__INITIAL_DATA__);

const store = configureStore(preloadedState);

hydrate(
    <Provider store={store}>
        <BrowserRouter>
            <App data={preloadedData}/>
        </BrowserRouter>
    </Provider>,
    root,
    () => {
        root.style.opacity = 1;
    }
);
