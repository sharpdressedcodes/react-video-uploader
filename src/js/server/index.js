import React from 'react';
import express from 'express';
import csrf from 'csurf';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from 'react-global-configuration';
import mainConfig from '../config/main';
import handleGetVideos from './api/video/read';
import handleVideoCreate from './api/video/create';
import handleRender from './render';
import injectCsrf from './middleware/injectCsrf';
import loadConfig from './middleware/loadConfig';
import logErrors from './middleware/logErrors';
import trapErrors from './middleware/trapErrors';
import fakeFavIcon from './middleware/fakeFavIcon';
import checkVideoId from './middleware/checkVideoId';
import handleLoadVideos from './middleware/loadVideos';

const server = express();
const production = process.env.NODE_ENV === 'production';
const csrfMiddleware = csrf({ cookie: true, value: req => req.cookies.csrfToken });
const parseForm = bodyParser.urlencoded({ extended: true });

server.use(cors());
server.use(cookieParser());
server.use(loadConfig);
server.use(fakeFavIcon);
server.use(express.static('dist', {
    maxAge: production ? '1y' : 0,
    index: false
}));

// Set default config. If testing, this will be overridden by middleware
config.set(mainConfig, { freeze: false });

server.get(
    `${config.get('app.endpoints.api.video.get')}/:id?`,
    checkVideoId,
    handleGetVideos,
    logErrors,
    trapErrors,
);

server.post(
    config.get('app.endpoints.api.video.upload'),
    parseForm,
    csrfMiddleware,
    handleVideoCreate,
    handleGetVideos,
    logErrors,
    trapErrors,
);

server.get(
    '/*',
    csrfMiddleware,
    injectCsrf,
    handleLoadVideos,
    handleRender,
    logErrors,
    trapErrors,
);

const listener = server.listen(process.env.PORT || config.get('app.port', 3001), err => {
    if (err) {
        throw err;
    }

    // eslint-disable-next-line no-console
    console.log(`server listening on port ${listener.address().port}`);
});
