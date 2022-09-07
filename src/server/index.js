import os from 'node:os';
import http from 'node:http';
import express from 'express';
import cors from 'cors';
import csrf from 'csurf';
import chalk from 'chalk';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import handleGetVideos from './api/video/read';
import handleVideoCreate from './api/video/create';
import {
    checkVideoId,
    fakeFavIcon,
    injectCsrf,
    loadConfig,
    loadVideos,
    loadWebSocket,
    logErrors,
    render,
    trapErrors
} from './middleware';
import { routePaths } from '../routes';
import config from '../config';

const DEFAULT_PORT = 3000;
const DEFAULT_HOSTNAME = '0.0.0.0';
const app = express();
const server = http.createServer(app);
const isProduction = process.env.NODE_ENV?.toString().toLowerCase() === 'production';
const isMac = os.platform() === 'darwin';
const csrfMiddleware = csrf({ cookie: true, value: req => req.cookies.csrfToken });
const parseForm = bodyParser.urlencoded({ extended: true });

app.use(cors());
app.use(cookieParser());
app.use(loadConfig);
app.use(loadWebSocket(server));
app.use(fakeFavIcon);
app.use(express.static('build', {
    maxAge: isProduction ? '1y' : 0,
    index: false
}));

app.get(
    `${config.endpoints.api.video.get}/:id?`,
    checkVideoId,
    handleGetVideos,
    logErrors,
    trapErrors
);

app.post(
    config.endpoints.api.video.upload,
    parseForm,
    csrfMiddleware,
    handleVideoCreate,
    handleGetVideos,
    logErrors,
    trapErrors
);

app.get(
    '/*',
    csrfMiddleware,
    injectCsrf,
    loadVideos,
    render,
    logErrors,
    trapErrors
);

server.setTimeout(0);

server.on('error', err => {
    server.close();
    throw err;
});

const listener = server.listen(process.env.PORT || config.get('server.port', DEFAULT_PORT), config.get('server.hostName', DEFAULT_HOSTNAME), err => {
    if (err) {
        server.close();
        throw err;
    }

    const { address, port } = listener.address();
    const hostName = address === DEFAULT_HOSTNAME ? 'localhost' : address;

    // eslint-disable-next-line no-console
    console.log([
        `${chalk.green('Server ready!')} You can view the app at ${chalk.blue(`http://${hostName}:${port}${routePaths.homePage || '/'}`)}`,
        chalk.yellow(`press [${isMac ? 'COMMAND + .' : 'CTRL + C'}] to cancel`)
    ].join('\n'));
});
