import React from 'react';
import {renderToString} from 'react-dom/server';
import { matchPath, StaticRouter } from 'react-router-dom';
import {Provider} from 'react-redux';
import serialize from 'serialize-javascript';
import get from 'lodash/get';
import { readFile } from './fileOperations';
import routes from '../shared/routes';
import AppStore from '../stores/app';
import config from '../config/main';
import App from '../shared/app';

function renderFullPage(html, data, state) {
    // return new Promise((resolve, reject) => {
    //
    //     readFile(`${process.cwd()}/src/index.html`, 'utf8')
    //         .then(page => {
    //
    //             const parsedPage = page
    //                 .replace('{{pageTitle}}', get(config, 'app.title', 'Video Uploader'))
    //                 .replace('{{html}}', html)
    //                 .replace('{{data}}', serialize(data))
    //                 .replace('{{state}}', serialize(state));
    //
    //            // console.log(parsedPage);
    //
    //             resolve(parsedPage);
    //
    //         })
    //         .catch(reject);
    // });
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no">
    <title>Video Uploader</title>
    <link rel="stylesheet" media="screen" type="text/css" href="/bundle.css">
</head>
<body>
    <div id="app">${html}</div>
    <script charset="utf-8" src="/bundle.js"></script>
    <script>window.__INITIAL_DATA__ = ${serialize(data)};</script>
    <script>window.__PRELOADED_STATE__ = ${serialize(state)};</script>
</body>
</html>
    `;
}

export default async function handleRender(req, res, next) {

    const activeRoute = routes.find(route => matchPath(req.url, route)) || {};
    const promise = activeRoute.fetchInitialData ? activeRoute.fetchInitialData(req) : Promise.resolve(null);

    try {
        const response = await promise || {};
        const { data = {} } = response;
        //const data = { videos };

        console.log('handleRender', data.items);

        const markup = renderToString(
            <Provider store={AppStore}>
                <StaticRouter location={req.url} context={{ data, config }}>
                    <App data={data}/>
                </StaticRouter>
            </Provider>
        );


        const s = AppStore.getState();
        console.log('handleRender::beforeSend state', s);


        //res.send(await renderFullPage(markup, data, AppStore.getState()));
        res.send(renderFullPage(markup, data, AppStore.getState()));

    } catch (err) {
        next(err);
    }
}


