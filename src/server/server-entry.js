import path from 'node:path';
import fs from 'node:fs/promises';
import React, { StrictMode } from 'react';
import { renderToPipeableStream, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { matchPath } from 'react-router-dom';
import serialize from 'serialize-javascript';
import { routes } from '../routes';
import configureStore from '../stores/app';
import Providers from '../components/Providers';
import Html from '../components/Html';
import App from '../components/App';

const isProduction = process.env.NODE_ENV === 'production';

const renderContent = ({ data, store }) => (
    <StrictMode>
        <Providers store={ store }>
            <App data={ data } />
        </Providers>
    </StrictMode>
);
const renderHtml = ({
    bodyScripts,
    data,
    extraHeadContent,
    favIcons,
    manifestFile,
    scripts,
    store,
    styles,
    title,
    url,
    version,
    content,
}) => (
    <Html
        bodyScripts={ bodyScripts }
        extraHeadContent={ extraHeadContent }
        favIcons={ favIcons }
        initialData={ serialize(data) }
        manifestFile={ manifestFile }
        preloadedState={ serialize(store.getState()) }
        styles={ styles }
        scripts={ scripts }
        title={ title }
        version={ version }
    >
        <StaticRouter location={ url }>
            {content}
        </StaticRouter>
    </Html>
);
const getAssetsFromManifest = async manifestFile => {
    try {
        const file = path.join(process.cwd(), 'build', manifestFile);
        const manifest = (await fs.readFile(file));
        const json = JSON.parse(manifest.toString());
        // const css = ['app.css'/*, 'home-page.css'*/];
        // const js = ['app.js'/*, 'home-page.js'*/];
        const { css, js } = Object
            .keys(json)
            .reduce((acc, curr) => {
                if (curr.endsWith('.css')) {
                    return {
                        ...acc,
                        css: [
                            ...acc.css,
                            curr,
                        ],
                    };
                }

                if (curr.endsWith('.js') && !curr.startsWith('server-entry')) {
                    return {
                        ...acc,
                        js: [
                            ...acc.js,
                            curr,
                        ],
                    };
                }

                return acc;
            }, { css: [], js: [] })
        ;

        return {
            css,
            js,
            favIcons: json.icons,
        };
    } catch (err) {
        return { css: [], js: [], favIcons: [] };
    }
};

const serverEntry = (req, res, next) => new Promise(resolve => {
    (async () => {
        try {
            let hasError = false;
            const config = req.app.locals.config;
            const manifestFile = config.get('manifest.fileName');
            // NOTE: !isProduction automatically injects relevant js and css files when needed.
            // So if you go to 1 page, only that page js and css will have loaded.
            // If you navigate to another page, the js and css for that new page will then be injected.
            const assets = !isProduction
                ? { css: ['app.css'], js: ['app.js'], favIcons: [] }
                : await getAssetsFromManifest(manifestFile);
            const css = assets.css.map(p => <link key={ p } href={ `/${p}` } rel="stylesheet" />);
            // NOTE: renderToPipeableStream injects app.js automatically
            const bodyJs = null;
            const js = null;
            const activeRoute = routes.find(route => matchPath(route, req.url)) || {};
            const data = req.app.locals?.data?.videos || [];
            const store = configureStore();
            const content = renderContent({ data, store });
            const html = renderHtml({
                bodyScripts: bodyJs,
                content,
                data,
                extraHeadContent: null,
                favIcons: assets.favIcons,
                manifestFile,
                scripts: js,
                store,
                styles: css,
                title: activeRoute?.pageTitle || config.get('app.title', 'Video Uploader'),
                url: req.url,
                version: process.env.npm_package_version,
            });

            if (config.get('disableNodeStreaming')) {
                const str = renderToStaticMarkup(html);

                res.statusCode = 200;
                res.setHeader('Content-type', 'text/html');
                res.send(str);

                resolve();
                return;
            }

            const pipeOut = pipe => {
                res.statusCode = hasError ? 500 : 200;
                res.setHeader('Content-type', 'text/html');
                pipe(res);

                resolve();
            };
            const { pipe, abort } = renderToPipeableStream(html, {
                bootstrapScriptContent: '(function(){ window.boot ? window.boot() : (window.loaded = true) })();',
                bootstrapScripts: assets.js.map(item => `/${item}`),
                // If you use ESM, you use the bootstrapModules option instead of bootstrapScripts.
                bootstrapModules: [],
                onShellReady() {
                    // The content above all Suspense boundaries is ready.
                    // If something errored before we started streaming, we set the error code appropriately.

                    // console.log('onShellReady');
                    if (!req.app.locals.isBot) {
                        pipeOut(pipe);
                    }
                },
                onShellError(err) {
                    // Something errored before we could complete the shell, so we emit an alternative shell.
                    if (!isProduction) {
                        // eslint-disable-next-line no-console
                        console.log('onShellError', err);
                    }

                    next(err);
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
                    if (req.app.locals.isBot) {
                        pipeOut(pipe);
                    }
                },
                onError(err) {
                    hasError = true;
                    if (!isProduction) {
                        // eslint-disable-next-line no-console
                        console.error(`renderToPipeableStream Error: ${err.message}`, err);
                    }
                },
            });
        } catch (err) {
            next(err);
        }
    })();
});

export default serverEntry;
