const path = require('node:path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const packageJson = require('./package.json');

const isProduction = process.env.NODE_ENV?.toString().toLowerCase() === 'production';
const { version } = packageJson;

process.traceDeprecation = true;

const defaultConfig = {
    cache: false,
    devtool: isProduction ? false : 'eval-source-map',
    context: `${__dirname}/`,
    entry: [
        // Currently, @babel/preset-env is unaware that using import() with Webpack relies on Promise internally.
        // Environments which do not have builtin support for Promise, like Internet Explorer, will require both
        // the promise and iterator polyfills be added manually.
        'core-js/modules/es.promise',
        'core-js/modules/es.array.iterator'
    ],
    output: {
        globalObject: 'this',
        path: path.join(__dirname, 'build/'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            // Ensure there is only one instance of react when resolving modules. This helps with symlinks
            react: path.join(__dirname, 'node_modules/react'),
            'react-dom': path.join(__dirname, 'node_modules/react-dom')
        }
    },
    watchOptions: {
        aggregateTimeout: 600,
        poll: 1000
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/],
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                issuer: /\.jsx?$/,
                use: ['babel-loader', '@svgr/webpack', 'url-loader']
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader'
            },
            {
                test: /\.(png|jpg|gif|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }
        ]
    },
    plugins: [
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoEmitOnErrorsPlugin()
    ]
};

if (isProduction) {
    defaultConfig.plugins.push(new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
    }));
}

const browserConfig = {
    ...defaultConfig,
    target: 'web',
    entry: [
        ...defaultConfig.entry,
        './node_modules/normalize.css/normalize.css',
        './src/styles/main.scss',
        './src/index.js'
    ],
    output: {
        ...defaultConfig.output,
        filename: 'bundle.js'
    },
    module: {
        ...defaultConfig.module,
        rules: [
            ...defaultConfig.module.rules,
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false
                        }
                    },
                    'resolve-url-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                outputStyle: 'compressed'
                            }
                            // sourceMap: false
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        ...defaultConfig.plugins,
        new MiniCssExtractPlugin({
            filename: 'bundle.css'
        }),
        new webpack.DefinePlugin({
            __isBrowser__: 'true',
            'process.env': JSON.stringify(process.env)
        }),
        new HtmlWebpackPlugin({
            version,
            template: path.resolve(__dirname, './src/server/index.html')
        })
    ]
};

if (isProduction) {
    const terserPlugin = new TerserPlugin({
        parallel: true,
        extractComments: false,
        terserOptions: {
            format: {
                ecma: 5,
                comments: false,
                ascii_only: true
            }
        }
    });

    browserConfig.optimization = {
        minimize: true,
        minimizer: [
            '...',
            terserPlugin
        ]
    };
}

const serverConfig = {
    ...defaultConfig,
    entry: [
        ...defaultConfig.entry,
        './src/server/index.js'
    ],
    // target: 'node',
    externalsPresets: { node: true },
    externals: [nodeExternals({
        allowlist: ['react-toastify/dist/ReactToastify.css']
    })],
    output: {
        ...defaultConfig.output,
        filename: 'server.js'
    },
    module: {
        ...defaultConfig.module,
        rules: [
            ...defaultConfig.module.rules,
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: { emit: false }
                    },
                    // MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false
                        }
                    },
                    'resolve-url-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                outputStyle: 'compressed'
                            }
                            // sourceMap: false
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        ...defaultConfig.plugins,
        new MiniCssExtractPlugin({
            // filename: 'server.css'
        }),
        new webpack.DefinePlugin({
            __isBrowser__: 'false'
        })
    ]
};

module.exports = [
    serverConfig,
    browserConfig
];
