import React, { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { matchPath } from 'react-router-dom';
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';
import { readFile } from '../fileSystem';
import { routes } from '../../routes';
import configureStore from '../../stores/app';
import { App } from '../../components';

const renderMarkup = (html, data, state, activeRoute, config) => new Promise((resolve, reject) => {
    (async () => {
        try {
            const page = await readFile(`${process.cwd()}/build/index.html`, 'utf8');
            const parsedPage = page
                .replace(/{{pageTitle}}/g, activeRoute?.pageTitle || config?.app?.title || 'Video Uploader')
                .replace('{{html}}', html)
                .replace('{{data}}', serialize(data))
                .replace('{{state}}', serialize(state))
            ;

            resolve(parsedPage);
        } catch (err) {
            reject(err);
        }
    })();
});

export default async function handleRender(req, res, next) {
    try {
        const activeRoute = routes.find(route => matchPath(route, req.url)) || {};
        // const fetchPromise = activeRoute.fetchInitialData ? activeRoute.fetchInitialData(req) : Promise.resolve(null);
        // const response = await fetchPromise || {};
        const data = req.app.locals.data.videos;
        const config = req.app.locals.config;
        const store = configureStore();
        const markup = renderToString(
            <StrictMode>
                <Provider store={ store }>
                    <StaticRouter location={ req.url } context={ { data, config } }>
                        <App data={ data } />
                    </StaticRouter>
                </Provider>
            </StrictMode>
        );

        res.send(await renderMarkup(markup, data, store.getState(), activeRoute, config));
    } catch (err) {
        next(err);
    }
}
