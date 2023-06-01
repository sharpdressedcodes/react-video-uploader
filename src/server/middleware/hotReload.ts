/* eslint-disable import/no-extraneous-dependencies */
import webpack from 'webpack';
import { Configuration } from 'webpack/types';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../../../webpack.config';

const hotReload = (waitUntilValid?: () => void) => {
    Error.stackTraceLimit = Infinity;
    process.traceDeprecation = true;
    process.env.APP_ENV = 'browser';
    const compiler = webpack({
        ...webpackConfig,
        stats: 'errors-only',
    } as Configuration);
    const devMiddlewareInstance = devMiddleware(compiler, {
        publicPath: '/', // webpackConfig.output.publicPath,
        serverSideRender: true,
        // writeToDisk: true,
        index: false,
    });
    const hotMiddlewareInstance = hotMiddleware(compiler, {
        log: false,
    });

    if (waitUntilValid) {
        devMiddlewareInstance.waitUntilValid(waitUntilValid);
    }

    return [devMiddlewareInstance, hotMiddlewareInstance];
};

export default hotReload;
