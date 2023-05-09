import React, { StrictMode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { matchPath } from 'react-router-dom';
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';
import { routes } from '../routes';
import configureStore from '../stores/app';
import { App, Html } from '../components';
// import { isObject } from '../common';

// const normaliseAssets = assets => {
//     if (isObject(assets)) {
//         return Object.values(assets).flat();
//     }
//
//     return Array.isArray(assets) ? assets : [assets];
// };
const renderPage = ({ bodyScripts, config, data, scripts, store, styles, title, url, version }) => (
    <Html
        bodyScripts={ bodyScripts }
        initialData={ serialize(data) }
        preloadedState={ serialize(store.getState()) }
        styles={ styles }
        scripts={ scripts }
        title={ title }
        version={ version }
    >
        <StrictMode>
            <Provider store={ store }>
                <StaticRouter location={ url } context={ { data, config } }>
                    <App data={ data } />
                </StaticRouter>
            </Provider>
        </StrictMode>
    </Html>
);

const serverEntry = (req, res) => new Promise((resolve/* , reject */) => {
    let hasError = false;
    // devMiddleware only loads in watch or development mode
    // const { devMiddleware } = res.locals.webpack;
    // const { assetsByChunkName } = devMiddleware.stats.toJson();
    // const normalisedAssets = normaliseAssets(assetsByChunkName);
    // const css = normalisedAssets.filter(p => p.endsWith('.css')).map(p => <link key={ p } href={ p } rel="stylesheet" />);
    const css = ['app.css'].map(p => <link key={ p } href={ p } rel="stylesheet" />);
    // NOTE: renderToPipeableStream injects app.js automatically
    const bodyJs = null;// ['app.js'].map(p => <script async src={ p } key={ p } />);
    const js = null;// normalisedAssets.filter(p => p.endsWith('.js')).map(p => <script async src={ p } key={ p } />);
    const activeRoute = routes.find(route => matchPath(route, req.url)) || {};
    const config = req.app.locals.config;
    const page = renderPage({
        bodyScripts: bodyJs,
        config,
        data: req.app.locals?.data?.videos || [],
        scripts: js,
        store: configureStore(),
        styles: css,
        title: activeRoute?.pageTitle || config.get('app.title', 'Video Uploader'),
        url: req.url,
        version: process.env.npm_package_version,
    });
    const { pipe, abort } = renderToPipeableStream(page, {
        bootstrapScriptContent: '(function(){ window.boot ? window.boot() : (window.loaded = true) })();',
        bootstrapScripts: ['app.js'],
        bootstrapModules: [],
        onShellReady() {
            // The content above all Suspense boundaries is ready.
            // If something errored before we started streaming, we set the error code appropriately.

            // console.log('onShellReady');
            res.statusCode = hasError ? 500 : 200;
            res.setHeader('Content-type', 'text/html');
            pipe(res);

            resolve();
        },
        onShellError(err) {
            // Something errored before we could complete the shell, so we emit an alternative shell.
            // eslint-disable-next-line no-console
            console.log('onShellError', err);

            // res.statusCode = 500;
            // res.send(
            //     '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
            // );
        },
        onAllReady() {
            // If you don't want streaming, use this instead of onShellReady.
            // This will fire after the entire page content is ready.
            // You can use this for crawlers or static generation.

            // console.log('onAllReady');
            // res.statusCode = hasError ? 500 : 200;
            // res.setHeader('Content-type', 'text/html');
            // pipe(res);
        },
        onError(err) {
            hasError = true;
            // eslint-disable-next-line no-console
            console.error(`renderToPipeableStream Error: ${err.message}`);
        },
    });
});

export default serverEntry;
