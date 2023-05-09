/* eslint-disable import/no-extraneous-dependencies */
const path = require('node:path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

process.traceDeprecation = true;

const isProduction = process.env.NODE_ENV === 'production';
const isServer = process.env.APP_ENV === 'server';
const isFastRefresh = process.env.FAST_REFRESH === 'true';
const baseConfig = {
    watchOptions: {
        // aggregateTimeout: 600,
        // poll: 1000,
        ignored: '**/node_modules',
    },
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction && !isServer ? undefined : 'cheap-module-source-map', // 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: { loader: 'babel-loader' },
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                issuer: /\.jsx?$/,
                use: ['babel-loader', '@svgr/webpack', 'url-loader'],
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
            },
            {
                test: /\.(png|jpg|gif|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                },
            },
        ],
    },
    optimization: {
        concatenateModules: false,
        mergeDuplicateChunks: true,
        flagIncludedChunks: true,
        minimize: isProduction, // isProduction && !isServer
    },
    plugins: [
        /* !isServer && */!isProduction && isFastRefresh && new webpack.HotModuleReplacementPlugin(),
        /* !isServer && */!isProduction && isFastRefresh && new ReactRefreshWebpackPlugin({
            overlay: false,
            forceEnable: true,
            exclude: [/node_modules/],
            // overlay: {
            //     sockIntegration: 'whm'
            // }
        }),
        new MiniCssExtractPlugin({}),
        !isProduction ? false : new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
    ].filter(Boolean),
};
const browserConfig = {
    ...baseConfig,
    target: 'web',
    entry: {
        app: [
            !isProduction && isFastRefresh && 'webpack-hot-middleware/client?reload=true',
            'core-js/modules/es.promise',
            'core-js/modules/es.array.iterator',
            'normalize.css/normalize.css',
            path.resolve('./src/index.js'),
            // path.resolve('./src/bootstrap-chunk.js')
        ].filter(Boolean), // ,
        // sw: path.resolve('./src/sw.js')
    },
    output: {
        filename: '[name].js',
        path: path.resolve('build'),
    },
    module: {
        ...baseConfig.module,
        rules: [
            ...baseConfig.module.rules,
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false,
                        },
                    },
                    'resolve-url-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                outputStyle: 'compressed',
                            },
                            // sourceMap: false
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        ...baseConfig.plugins,
        new webpack.DefinePlugin({
            __isBrowser__: 'true',
        }),
    ].filter(Boolean),
    ...(!isProduction ? {} : {
        optimization: {
            ...baseConfig.optimization,
            // mergeDuplicateChunks: true,
            minimize: true,
            minimizer: [
                '...',
                new TerserPlugin({
                    parallel: true,
                    extractComments: false,
                    terserOptions: {
                        format: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true,
                        },
                    },
                }),
            ],
        },
    }),
};
const serverConfig = {
    ...baseConfig,
    target: 'node18',
    entry: path.resolve('./src/server/server-entry.js'),
    output: {
        filename: 'server-entry.js',
        path: path.resolve('build'),
        library: {
            type: 'commonjs2',
        },
    },
    module: {
        ...baseConfig.module,
        rules: [
            ...baseConfig.module.rules,
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            emit: false,
                        },
                    },
                    // MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false,
                        },
                    },
                    'resolve-url-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                outputStyle: 'compressed',
                            },
                            // sourceMap: false
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        ...baseConfig.plugins,
        new webpack.DefinePlugin({
            __isBrowser__: 'false',
        }),
    ].filter(Boolean),
    externals: [nodeExternals({
        allowlist: ['react-toastify/dist/ReactToastify.css'],
    })],
    externalsPresets: { node: true },
};

module.exports = isServer ? serverConfig : browserConfig;
