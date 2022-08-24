import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { matchPath } from 'react-router-dom';
import { Provider } from 'react-redux';
// import config from 'react-global-configuration';
import serialize from 'serialize-javascript';
import { readFile } from './fileOperations';
import routes from '../shared/routes';
import configureStore from '../stores/app';
import App from '../shared/app';
import config from '../config';

function renderFullPage(html, data, state) {
    return new Promise((resolve, reject) => {
        readFile(`${process.cwd()}/build/index.html`, 'utf8')
            .then(page => {
                const parsedPage = page
                    .replace(/{{pageTitle}}/g, config?.app?.title || 'Video Uploader')
                    .replace('{{html}}', html)
                    .replace('{{data}}', serialize(data))
                    // .replace('{{config}}', config.serialize())
                    .replace('{{state}}', serialize(state));

                resolve(parsedPage);
            })
            .catch(reject);
    });
}

export default async function handleRender(req, res, next) {
    try {
        const activeRoute = routes.find(route => matchPath(route, req.url)) || {};
        // const fetchPromise = activeRoute.fetchInitialData ? activeRoute.fetchInitialData(req) : Promise.resolve(null);
        // const response = await fetchPromise || {};
        const data = req.app.locals.data.videos;
        const store = configureStore();
        const markup = renderToString(
            <Provider store={store}>
                <StaticRouter location={req.url} context={{ data, config }}>
                    <App data={data} />
                </StaticRouter>
            </Provider>
        );
        // const markup = renderToString(
        //     <Provider store={store}>
        //         <App data={data} />
        //     </Provider>
        // );

        res.send(await renderFullPage(markup, data, store.getState()));
    } catch (err) {
        next(err);
    }
}
