/* eslint-disable no-console */
import os from 'node:os';
import http from 'node:http';
import { AddressInfo } from 'node:net';
import express from 'express';
import cors from 'cors';
import csrf from 'csurf';
import chalk from 'chalk';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import {
    checkForBot,
    checkVideoId,
    // fakeFavIcon,
    hotReload,
    injectCsrf,
    loadConfig,
    loadVideos,
    loadWebSocket,
    logErrors,
    render,
    securityHeaders,
    staticServer,
    trapErrors,
} from './middleware';
import { handleGetVideos, handleVideoCreate } from './api/video';
import routePaths from '../routes/paths';
import config from '../config';

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = '0.0.0.0';
const app = express();
const server = http.createServer(app);
const isProduction = process.env.NODE_ENV === 'production';
const isFastRefresh = process.env.FAST_REFRESH === 'true';
const isMac = os.platform() === 'darwin';
const csrfMiddleware = csrf({ cookie: true, value: req => req.cookies.csrfToken });
const parseForm = bodyParser.urlencoded({ extended: true });
let serverStartupMessage: string;

const closeServer = (message: string, exitProcess = false) => {
    console.log(message);

    try {
        server.close();
    } catch (err: unknown) {
        console.error(`Error closing server: ${(err as Error).message}`);
    }

    try {
        if (exitProcess) {
            process.exit();
        }
    } catch (err: unknown) {
        console.error(`Error ending server process: ${(err as Error).message}`);
    }
};
const onBundleValid = () => {
    if (serverStartupMessage) {
        console.log(serverStartupMessage);
        serverStartupMessage = '';
    }
};
const onTerminated = (signal: string) => () => {
    closeServer(`Received ${signal}, closing server.`, true);
};
const onStreamEnd = () => {
    closeServer('Received stdin:end, gracefully closing server.', true);
};
const onServerError = (err: Error) => {
    closeServer(`Server Error: ${err.message}, closing server.`);
    throw err;
};
const setupMiddleware = () => {
    app.use(cors());
    app.use(securityHeaders);
    app.use(cookieParser());
    app.use(loadConfig);
    app.use(checkForBot);
    app.use(loadWebSocket(server));
    // app.use(fakeFavIcon);

    if (isFastRefresh) {
        app.use(hotReload(onBundleValid));
    }

    app.use(staticServer('build/browser', isProduction));
};
const setupRoutes = () => {
    app.get(
        `${config.endpoints.api.video.get}/:id?`,
        checkVideoId,
        handleGetVideos,
        logErrors,
        trapErrors,
    );

    app.post(
        config.endpoints.api.video.upload,
        parseForm,
        csrfMiddleware,
        handleVideoCreate,
        handleGetVideos,
        logErrors,
        trapErrors,
    );

    app.get(
        '*',
        csrfMiddleware,
        injectCsrf,
        loadVideos,
        render,
        logErrors,
        trapErrors,
    );
};
const setupServer = () => {
    ['INT', 'TERM'].forEach(sig => {
        const signal = `SIG${sig}`;

        process.on(signal, onTerminated(signal));
    });

    if (process.env.CI !== 'true') {
        // Gracefully exit when stdin ends
        process.stdin.on('end', onStreamEnd);
    }

    server.setTimeout(0);
    server.on('error', onServerError);
};
const listen = () => {
    try {
        const listener = server.listen(
            (process.env.PORT || (config.server.port ?? DEFAULT_PORT)) as number,
            process.env.HOST || (config.server.hostName ?? DEFAULT_HOST),
            () => {
                const { address, port } = listener.address() as AddressInfo;
                const hostName = address === DEFAULT_HOST ? 'localhost' : address;

                serverStartupMessage = [
                    `${chalk.green('Server ready!')} You can view the app at ${chalk.cyan(`http://${hostName}:${port}${routePaths.homePage || '/'}`)}`,
                    chalk.yellow(`press [${isMac ? 'COMMAND + .' : 'CTRL + C'}] to cancel`),
                ].join('\n');

                if (!isFastRefresh && !isProduction) {
                    console.log(serverStartupMessage);
                }
            },
        );
    } catch (err: unknown) {
        closeServer(`Server Catch Error: ${(err as Error).message}, closing server.`, true);
    }
};
const run = () => {
    setupMiddleware();
    setupRoutes();
    setupServer();
    listen();
};

run();
/* eslint-enable no-console */
