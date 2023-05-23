/* eslint-disable import/no-extraneous-dependencies */
const path = require('node:path');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

process.traceDeprecation = true;

const isProduction = process.env.NODE_ENV === 'production';
const commonOptions = {
    name: 'common',
    watchOptions: {
        ignored: '**/node_modules',
    },
    target: 'node18',
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? undefined : 'cheap-module-source-map', // 'inline-source-map',
    entry: {
        index: path.resolve('./src/common/index.js'),
    },
    output: {
        filename: '[name].cjs',
        path: path.resolve('./src/common'),
        publicPath: '',
        library: {
            type: 'commonjs-static',
        },
    },
    externals: [nodeExternals({})],
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
                test: /\.(png|jpg|jpeg|gif|ico)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]',
                },
                // loader: 'url-loader',
                // options: {
                //     limit: 10000,
                // },
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]',
                },
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({}),
    ],
};
const configOptions = {
    name: 'config',
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
    ...configOptions,
    name: 'route',
    entry: './src/routes/paths.js',
    output: {
        ...configOptions.output,
        filename: 'paths.cjs',
        path: path.join(process.cwd(), './src/routes'),
    },
};

module.exports = [
    commonOptions,
    configOptions,
    routeOptions,
];
