/* eslint-disable no-console */
import os from 'node:os';
import http from 'node:http';
import { AddressInfo } from 'node:net';
import express from 'express';
import cors from 'cors';
import { csrfSync } from 'csrf-sync';
import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import {
    checkForBot,
    checkVideoId,
    // fakeFavIcon,
    hotReload,
    loadConfig,
    loadSession,
    loadVideos,
    loadWebSocket,
    logErrors,
    render,
    securityHeaders,
    staticServer,
    storeCsrfInSession,
    trapErrors,
    uploadParser,
} from './middleware';
import { handleGetVideos, handleVideoCreate, injectEmitMethods, emitUploadStatusStep } from './api/video';
import handleContactSubmit from './api/contact/submit';
import routePaths from '../routes/paths';
import config from '../config';

const sessionSecret = 'To be or not to be, said he, who was not.';
const DEFAULT_PORT = 3000;
const DEFAULT_HOST = '0.0.0.0';
const app = express();
const server = http.createServer(app);
const isProduction = process.env.NODE_ENV === 'production';
const isFastRefresh = process.env.FAST_REFRESH === 'true';
const isMac = os.platform() === 'darwin';
const {
    // invalidCsrfTokenError, // This is just for convenience if you plan on making your own middleware.
    generateToken, // Use this in your routes to generate, store, and get a CSRF token.
    // getTokenFromRequest, // use this to retrieve the token submitted by a user
    // getTokenFromState, // The default method for retrieving a token from state.
    storeTokenInState, // The default method for storing a token in state.
    // revokeToken, // Revokes/deletes a token by calling storeTokenInState(undefined)
    csrfSynchronisedProtection, // This is the default CSRF protection middleware.
} = csrfSync();
let serverStartupMessage: string;

// const bodyParser = () => express.urlencoded({ extended: true });
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
    app.use(loadSession(sessionSecret));
    app.use(cookieParser(sessionSecret));
    app.use(storeCsrfInSession(generateToken, storeTokenInState));
    app.use(loadConfig);
    app.use(checkForBot);
    app.use(loadWebSocket(server));
    app.use(injectEmitMethods);
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
        // Not using bodyParser because we have a file field
        // and using 'multipart/form-data' on the form.
        // bodyParser(),
        csrfSynchronisedProtection,
        emitUploadStatusStep,
        // req.files and req.body are both empty at this point.
        uploadParser(config.videoUpload.path, 'videos', true),
        // req.files and req.body and now available.
        handleVideoCreate,
        handleGetVideos,
        logErrors,
        trapErrors,
    );

    app.post(
        config.endpoints.api.contact.submit,
        csrfSynchronisedProtection,
        uploadParser(config.contactUpload.path, 'files', true),
        handleContactSubmit,
        logErrors,
        trapErrors,
    );

    app.get(
        '*',
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
