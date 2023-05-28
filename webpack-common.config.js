/* eslint-disable import/no-extraneous-dependencies */
const path = require('node:path');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

process.traceDeprecation = true;

const isProduction = process.env.NODE_ENV === 'production';
const commonOptions = {
    name: 'common',
    watchOptions: {
        ignored: '**/node_modules',
    },
    target: 'node18',
    mode: isProduction ? 'production' : 'development',
    // devtool: isProduction ? undefined : 'cheap-module-source-map', // 'inline-source-map',
    devtool: isProduction ? undefined : 'source-map', // 'inline-source-map',
    entry: {
        index: path.resolve('./src/common/index.ts'),
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
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                // use: { loader: 'babel-loader' },
                use: ['source-map-loader', 'babel-loader'],
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
                issuer: /\.tsx?$/,
                use: ['ts-loader', '@svgr/webpack', 'url-loader'],
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
        // new ESLintPlugin({}),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },
};
const configOptions = {
    name: 'config',
    cache: false,
    // devtool: isProduction ? undefined : 'cheap-module-source-map', // 'inline-source-map',
    devtool: isProduction ? undefined : 'source-map', // 'inline-source-map',
    context: `${process.cwd()}/`,
    // entry: './src/config/index.js',
    entry: './src/config/index.ts',
    output: {
        path: path.join(process.cwd(), './src/config'),
        filename: 'index.cjs',
        publicPath: '/',
        library: {
            // note there's no `name` here
            type: 'commonjs-static',
        },
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                // use: { loader: 'babel-loader' },
                use: ['source-map-loader', 'babel-loader'],
            },
        ],
    },
    externalsPresets: { node: true },
    externals: [nodeExternals({})],
    plugins: [
        // new ESLintPlugin({}),
    ],
};
const routeOptions = {
    ...configOptions,
    name: 'route',
    entry: './src/routes/paths.ts',
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
