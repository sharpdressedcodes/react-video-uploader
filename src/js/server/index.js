/* eslint-disable no-console */
import React from 'react'
import express from 'express';
import csrf from 'csurf';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import get from 'lodash/get';
import config from '../config/main';
import { createDirectory } from './fileOperations';
import handleGetVideos from './api/video/read';
import handleVideoCreate from './api/video/create';
import handleRender from './render';
import injectCsrf from './middleware/injectCsrf';
import logErrors from './middleware/logErrors';
import trapErrors from './middleware/trapErrors';
import fakeFavIcon from './middleware/fakeFavIcon';

import serialize from "serialize-javascript";
import routes from "../shared/routes";
import {renderToString} from "react-dom/server";
import {Provider} from "react-redux";
import AppStore from "../stores/app";
import App from "../shared/app";
import { matchPath, StaticRouter } from 'react-router-dom';

const csrfMiddleware = csrf({ cookie: true, value: req => req.cookies.csrfToken });
const parseForm = bodyParser.urlencoded({ extended: true });
const server = express();
const production = process.env.NODE_ENV === 'production';
const uploadPath = get(config, 'app.videoUpload.path', 'dist/uploads');

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
    <script charset="utf-8" src="/bundle.js" defer></script>
    <script>window.__INITIAL_DATA__ = ${serialize(data)}</script>
    <script>window.__PRELOADED_STATE__ = ${serialize(state)}</script>
</body>
</html>
    `;
}

(async function ensureUploadPathExists() {
    try {
        await createDirectory(uploadPath);
    } catch (err) {
        console.error(err);
    }
}());

server.use(cors());
server.use(cookieParser());
server.use(fakeFavIcon);
server.use(express.static('dist', {
    maxAge: production ? '1y' : 0,
    index: false
}));

server.get(
    `${config.app.endpoints.api.video.get}/:id?`,
    handleGetVideos,
    //logErrors,
    //trapErrors
);

// server.post(
//     config.app.endpoints.api.video.upload,
//     parseForm,
//     csrfMiddleware,
//     handleVideoCreate,
//     //logErrors,
//     //trapErrors
// );

// server.get(
//     '/*',
//     csrfMiddleware,
//     //injectCsrf,
//     handleRender,
//     //logErrors,
//     //trapErrors
// );

server.get('/*', async (req, res, next) => {

    console.log('handleRender::start', (+new Date()), req.url, req.path);

    if (req.path === '/favicon.ico') {
        console.log('bloody favicon');
        next();
        return;
    }

    try {

        const activeRoute = routes.find(route => matchPath(req.url, route)) || {};
        const promise = activeRoute.fetchInitialData ? activeRoute.fetchInitialData(req) : Promise.resolve(null);

        const response = await promise || {};
        const { data = {} } = response;
        //const data = { videos };

        console.log('handleRender', data.items ? data.items.length : undefined, (+new Date()));

        const markup = renderToString(
            <Provider store={AppStore}>
                <StaticRouter location={req.url} context={{ data, config }}>
                    <App data={data}/>
                </StaticRouter>
            </Provider>
        );

        const s = AppStore.getState();
        //console.log('handleRender::beforeSend state', s);
        console.log('handleRender::beforeSend', (+new Date()));

        //res.send(await renderFullPage(markup, data, AppStore.getState()));
        res.send(renderFullPage(markup, data, AppStore.getState()));
        console.log('handleRender::afterSend', (+new Date()));

    } catch (err) {
        console.log('handleRender::error', err.message);
        next(err);
    }

    console.log('handleRender::end', (+new Date()), '\n\n');

});

const listener = server.listen(process.env.PORT || get(config, 'app.port', 3001), err => {
    if (err) {
        throw err;
    }

    console.log(`server listening on port ${listener.address().port}`);
});
/* eslint-enable no-console */
