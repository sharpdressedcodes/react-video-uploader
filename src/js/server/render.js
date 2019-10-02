import React from 'react';
import {renderToString} from 'react-dom/server';
import { matchPath, StaticRouter } from 'react-router-dom';
import {Provider} from 'react-redux';
import serialize from 'serialize-javascript';
import get from 'lodash/get';
import { readFile } from './fileOperations';
import routes from '../shared/routes';
import configureStore from '../stores/app';
import config from '../config/main';
import App from '../shared/app';

function renderFullPage(html, data, state) {
    return new Promise((resolve, reject) => {

        readFile(`${process.cwd()}/src/index.html`, 'utf8')
            .then(page => {
                const parsedPage = page
                    .replace('{{pageTitle}}', get(config, 'app.title', 'Video Uploader'))
                    .replace('{{html}}', html)
                    .replace('{{data}}', serialize(data))
                    .replace('{{state}}', serialize(state));

                resolve(parsedPage);
            })
            .catch(reject);
    });
}

export default async function handleRender(req, res, next) {

    try {

        const activeRoute = routes.find(route => matchPath(req.url, route)) || {};
        //const fetchPromise = activeRoute.fetchInitialData ? activeRoute.fetchInitialData(req) : Promise.resolve(null);
        const data = req.app.locals.data.videos;
        //const response = await fetchPromise || {};
        //const { data = {} } = response;
        //const data = { videos };

        //console.log('handleRender', data.items);

        const store = configureStore();
        const markup = renderToString(
            <Provider store={store}>
                <StaticRouter location={req.url} context={{ data, config }}>
                    <App data={data}/>
                </StaticRouter>
            </Provider>
        );


        res.send(await renderFullPage(markup, data, store.getState()));

    } catch (err) {
        next(err);
    }
}


