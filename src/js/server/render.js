import React from 'react';
import { renderToString } from 'react-dom/server';
import { matchPath, StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import config from 'react-global-configuration';
import serialize from 'serialize-javascript';
import { readFile } from './fileOperations';
import routes from '../shared/routes';
import configureStore from '../stores/app';
import App from '../shared/app';

function renderFullPage(html, data, state) {
    return new Promise((resolve, reject) => {
        readFile(`${process.cwd()}/src/index.html`, 'utf8')
            .then(page => {
                const parsedPage = page
                    .replace('{{pageTitle}}', config.get('app.title', 'Video Uploader'))
                    .replace('{{html}}', html)
                    .replace('{{data}}', serialize(data))
                    .replace('{{config}}', config.serialize())
                    .replace('{{state}}', serialize(state));

                resolve(parsedPage);
            })
            .catch(reject);
    });
}

export default async function handleRender(req, res, next) {
    try {
        const activeRoute = routes.find(route => matchPath(req.url, route)) || {};
        // const fetchPromise = activeRoute.fetchInitialData ? activeRoute.fetchInitialData(req) : Promise.resolve(null);
        // const response = await fetchPromise || {};
        const data = req.app.locals.data.videos;
        const store = configureStore();
        const markup = renderToString(
            <Provider store={store}>
                <StaticRouter location={req.url} context={{ data, config: {app: config.get('app')} }}>
                    <App data={data} />
                </StaticRouter>
            </Provider>
        );

        res.send(await renderFullPage(markup, data, store.getState()));
    } catch (err) {
        next(err);
    }
}
