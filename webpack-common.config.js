/* eslint-disable import/no-extraneous-dependencies */
const path = require('node:path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

process.traceDeprecation = true;

const isProduction = process.env.NODE_ENV === 'production';
const commonOptions = {
    watchOptions: {
        // aggregateTimeout: 600,
        // poll: 1000,
        ignored: '**/node_modules',
    },
    target: 'node18',
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? undefined : 'cheap-module-source-map', // 'inline-source-map',
    entry: path.resolve('./src/common/index.js'),
    output: {
        filename: 'index.cjs',
        path: path.resolve('./src/common'),
        publicPath: '',
        // clean: true,
        library: {
            type: 'commonjs-static',
        },
    },
    externals: [nodeExternals({
        allowlist: ['react-toastify/dist/ReactToastify.css'],
    })],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: { loader: 'babel-loader' },
            },
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: { emit: false },
                    },
                    {
                        loader: 'css-loader',
                        options: { sourceMap: false },
                    },
                    {
                        loader: 'postcss-loader',
                        options: { sourceMap: false },
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
        minimize: false, // isProduction && !isServer
    },
    plugins: [
        /* !isServer && */!isProduction && new webpack.HotModuleReplacementPlugin(),
        /* !isServer && */!isProduction && new ReactRefreshWebpackPlugin({
            overlay: false,
            forceEnable: true,
            exclude: [/node_modules/],
            // overlay: {
            //     sockIntegration: 'whm'
            // }
        }),
        new MiniCssExtractPlugin({}),
    ].filter(Boolean),
};
const configOptions = {
    cache: false,
    devtool: false,
    context: `${process.cwd()}/`,
    entry: './src/config/index.js',
    output: {
        path: path.join(process.cwd(), './src/config'),
        filename: 'index.cjs',
        publicPath: '/',
        library: {
            // note there's no `name` here
            type: 'commonjs-static',
        },
    },
    resolve: { extensions: ['.js'] },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    externalsPresets: { node: true },
    externals: [nodeExternals({})],
};
const routeOptions = {
    ...commonOptions,
    entry: './src/routes/index.js',
    output: {
        ...commonOptions.output,
        path: path.join(process.cwd(), './src/routes'),
    },
};

module.exports = [
    commonOptions,
    configOptions,
    routeOptions,
];
