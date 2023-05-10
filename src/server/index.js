/* eslint-disable global-require, no-console */
const os = require('node:os');
const http = require('node:http');
const express = require('express');
const cors = require('cors');
const csrf = require('csurf');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {
    checkVideoId,
    fakeFavIcon,
    injectCsrf,
    loadConfig,
    loadVideos,
    loadWebSocket,
    logErrors,
    render,
    securityHeaders,
    trapErrors,
} = require('./middleware');
const {
    handleGetVideos,
    handleVideoCreate,
} = require('./api/video');
const config = require('../config/index.cjs').default;
const routePaths = require('../routes/paths.cjs');

const DEFAULT_PORT = 3000;
const DEFAULT_HOSTNAME = '0.0.0.0';
const app = express();
const server = http.createServer(app);
const isProduction = process.env.NODE_ENV === 'production';
const isFastRefresh = process.env.FAST_REFRESH === 'true';
const isMac = os.platform() === 'darwin';
const csrfMiddleware = csrf({ cookie: true, value: req => req.cookies.csrfToken });
const parseForm = bodyParser.urlencoded({ extended: true });
let serverStartupMessage = null;

app.use(cors());
app.use(securityHeaders);
app.use(cookieParser());
app.use(loadConfig);
app.use(loadWebSocket(server));
app.use(fakeFavIcon);

if (isFastRefresh) {
    Error.stackTraceLimit = Infinity;
    process.traceDeprecation = true;
    process.env.APP_ENV = 'browser';

    const webpackConfig = require('../../webpack.config');
    /* eslint-disable import/no-extraneous-dependencies */
    const webpack = require('webpack');
    const devMiddleware = require('webpack-dev-middleware');
    const hotMiddleware = require('webpack-hot-middleware');
    /* eslint-enable import/no-extraneous-dependencies */
    const compiler = webpack({
        ...webpackConfig,
        stats: 'errors-only',
    });
    const devMiddlewareInstance = devMiddleware(compiler, {
        publicPath: '/', // webpackConfig.output.publicPath,
        serverSideRender: true,
        // writeToDisk: true,
        index: false,
    });
    const hotMiddlewareInstance = hotMiddleware(compiler, {
        log: false,
    });

    app.use([devMiddlewareInstance, hotMiddlewareInstance]);

    devMiddlewareInstance.waitUntilValid(() => {
        if (serverStartupMessage) {
            console.log(serverStartupMessage);
            serverStartupMessage = null;
        }
    });
}

app.get('/server-entry.js', (req, res) => {
    res.status(404).send('');
});

app.use(express.static('build', {
    maxAge: isProduction ? '1y' : 0,
    index: false,
}));

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

const closeServer = (message, exitProcess = false) => {
    console.log(message);

    try {
        server.close();
    } catch (err) {
        console.error(`Error closing server: ${err.message}`);
    }

    try {
        if (exitProcess) {
            process.exit();
        }
    } catch (err) {
        console.error(`Error ending server process: ${err.message}`);
    }
};

['SIGINT', 'SIGTERM'].forEach(sig => {
    process.on(sig, () => {
        closeServer(`Received ${sig}, closing server.`, true);
    });
});

if (process.env.CI !== 'true') {
    // Gracefully exit when stdin ends
    process.stdin.on('end', () => {
        closeServer(`Received stdin:end, gracefully closing server.`, true);
    });
}

server.setTimeout(0);

server.on('error', err => {
    closeServer(`Server Error: ${err.message}, closing server.`);
    throw err;
});

try {
    const listener = server.listen(
        process.env.PORT || config.get('server.port', DEFAULT_PORT),
        process.env.HOST || config.get('server.hostName', DEFAULT_HOSTNAME),
        err => {
            if (err) {
                closeServer(`Server Listen Error: ${err.message}, closing server.`);
                throw err;
            }

            const { address, port } = listener.address();
            const hostName = address === DEFAULT_HOSTNAME ? 'localhost' : address;

            serverStartupMessage = [
                `${chalk.green('Server ready!')} You can view the app at ${chalk.cyan(`http://${hostName}:${port}${routePaths.homePage || '/'}`)}`,
                chalk.yellow(`press [${isMac ? 'COMMAND + .' : 'CTRL + C'}] to cancel`),
            ].join('\n');

            if (!isFastRefresh && !isProduction) {
                console.log(serverStartupMessage);
            }
        },
    );
} catch (err) {
    closeServer(`Server Catch Error: ${err.message}, closing server.`, true);
}
/* eslint-enable global-require, no-console */
