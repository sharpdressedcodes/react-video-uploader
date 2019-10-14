import React from 'react';
import express from 'express';
import csrf from 'csurf';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import io from 'socket.io';
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

const app = express();
const server = http.createServer(app);
const ioServer = io(server);
const production = process.env.NODE_ENV === 'production';
const csrfMiddleware = csrf({ cookie: true, value: req => req.cookies.csrfToken });
const parseForm = bodyParser.urlencoded({ extended: true });
let globalSocket = null;

ioServer.on('connection', socket => {
    globalSocket = socket;
});

app.use(cors());
app.use(cookieParser());
app.use(loadConfig);
app.use((req, res, next) => {
    req.app.locals.getSocket = function(){
        return globalSocket;
    };
    next();
});
app.use(fakeFavIcon);
app.use(express.static('dist', {
    maxAge: production ? '1y' : 0,
    index: false
}));

// Set default config. If testing, this will be overridden by middleware
config.set(mainConfig, { freeze: false });

app.get(
    `${config.get('app.endpoints.api.video.get')}/:id?`,
    checkVideoId,
    handleGetVideos,
    logErrors,
    trapErrors,
);

app.post(
    config.get('app.endpoints.api.video.upload'),
    parseForm,
    csrfMiddleware,
    handleVideoCreate,
    handleGetVideos,
    logErrors,
    trapErrors,
);

app.get(
    '/*',
    csrfMiddleware,
    injectCsrf,
    handleLoadVideos,
    handleRender,
    logErrors,
    trapErrors,
);

server.setTimeout(0);

const listener = server.listen(process.env.PORT || config.get('app.port', 3001), err => {
    if (err) {
        throw err;
    }

    // eslint-disable-next-line no-console
    console.log(`server listening on port ${listener.address().port}`);
});
