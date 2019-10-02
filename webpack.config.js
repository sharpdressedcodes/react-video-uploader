const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

process.traceDeprecation = true;

// const defaultConfig = {
//     bail: true,
//     cache: false,
//     devtool: production ? false : 'eval-source-map',
//     context: __dirname + '/',
//     entry: ['@babel/polyfill'],
//     output: {
//         path: __dirname + '/dist/',
//         publicPath: '/dist/',
//         filename: 'bundle.js',
//     },
//     resolve: {
//         extensions: ['.js', '.jsx'],
//         alias: {
//             /*
//                 ensure there is only one instance of react when resolving modules
//                 this helps with symlinks
//             */
//             react: path.join(__dirname, 'node_modules/react'),
//             'react-dom': path.join(__dirname, 'node_modules/react-dom')
//         }
//     },
//     watchOptions: {
//         aggregateTimeout: 600,
//         poll: 1000
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.js$/,
//                 exclude: [/node_modules/],
//                 use: {
//                     loader: 'babel-loader',
//                     options: {
//                         presets: [
//                             '@babel/preset-env',
//                             '@babel/preset-react'
//                         ],
//                         plugins: [[require('@babel/plugin-proposal-decorators'), { legacy: true }]]
//                     }
//                 }
//             },
//             {
//                 test: /\.s?css$/,
//                 use: [
//                     MiniCssExtractPlugin.loader,
//                     {
//                         loader: 'css-loader',
//                         options: {
//                             sourceMap: false,
//                         }
//                     },
//                     {
//                         loader: 'postcss-loader',
//                         options: {
//                             sourceMap: false,
//                             plugins: () => [
//                                 autoprefixer({})
//                             ]
//                         }
//                     },
//                     'resolve-url-loader',
//                     {
//                         loader: 'sass-loader',
//                         options: {
//                             sourceMap: false,
//                             outputStyle: 'compressed'
//                         }
//                     }
//                 ]
//             },
//             {
//                 test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
//                 loader: 'url-loader',
//                 options: {
//                     limit: 10000
//                 }
//             }
//         ]
//     },
//     plugins: [
//         new MiniCssExtractPlugin({
//             filename: `bundle.css`
//         }),
//     ]
// };
//
// if (production) {
//     const uglifyPlugin = new UglifyJsPlugin({
//         sourceMap: false,
//         parallel: true,
//         uglifyOptions: {
//             beautify: false,
//             mangle: false,
//             compress: false
//         }
//     });
//
//     const definePlugin = new webpack.DefinePlugin({
//         'process.env.NODE_ENV': JSON.stringify('production')
//     });
//
//     defaultConfig.plugins.push(uglifyPlugin);
//     defaultConfig.plugins.push(definePlugin);
// }
//
// const browserConfig = {
//     ...defaultConfig,
//     entry: [...defaultConfig.entry, './src/js/browser/index.js', './src/scss/main.scss'],
//     output: {
//         ...defaultConfig.output,
//         filename: 'bundle.js',
//     },
//     plugins: [
//         ...defaultConfig.plugins,
//         new webpack.DefinePlugin({
//             __isBrowser__: "true"
//         })
//     ]
// };
//
// const serverConfig = {
//     ...defaultConfig,
//     entry: [...defaultConfig.entry, './src/js/server/index.js'],
//     target: 'node',
//     externals: [nodeExternals({
//         whitelist: ['react-toastify/dist/ReactToastify.css']
//     })],
//     output: {
//         ...defaultConfig.output,
//         filename: 'server.js',
//     },
//     plugins: [
//         ...defaultConfig.plugins,
//         new webpack.DefinePlugin({
//             __isBrowser__: "false"
//         })
//     ]
// };

const browserConfig = {
    bail: true,
    cache: false,
    devtool: production ? false : 'eval-source-map',
    context: __dirname + '/',
    //entry: './src/js/browser/index.js',
    entry: ['@babel/polyfill', './src/js/browser/index.js', './src/scss/main.scss'],
    output: {
        //path: path.resolve(__dirname, 'public'),
        //publicPath: '/',
        path: __dirname + '/dist/',
        publicPath: '/dist/',
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            /*
                ensure there is only one instance of react when resolving modules
                this helps with symlinks
            */
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
                test: /\.js$/,
                exclude: [/node_modules/],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ],
                        plugins: [[require('@babel/plugin-proposal-decorators'), { legacy: true }]]
                    }
                }
            },
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false,
                            plugins: () => [
                                autoprefixer({})
                            ]
                        }
                    },
                    'resolve-url-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                            outputStyle: 'compressed'
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `bundle.css`
        }),
        new webpack.DefinePlugin({
            __isBrowser__: "true"
        })
    ]
};

const serverConfig = {
    bail: true,
    cache: false,
    devtool: production ? false : 'eval-source-map',
    //entry: './src/js/server/index.js',
    entry: ['@babel/polyfill', './src/js/server/index.js'],//, './src/scss/main.scss'],
    target: 'node',
    externals: [nodeExternals({
        whitelist: ['react-toastify/dist/ReactToastify.css']
    })],
    output: {
        //path: __dirname,
        //publicPath: '/',
        path: __dirname + '/dist/',
        publicPath: '/dist/',
        filename: 'server.js',
    },
    // module: {
    //     rules: [
    //         { test: /\.(js)$/, use: 'babel-loader' }
    //     ]
    // },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ],
                        plugins: [[require('@babel/plugin-proposal-decorators'), { legacy: true }]]
                    }
                }
            },
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
                            sourceMap: false,
                            plugins: () => [
                                autoprefixer({})
                            ]
                        }
                    },
                    'resolve-url-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                            outputStyle: 'compressed'
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `bundle.css`
        }),
        new webpack.DefinePlugin({
            __isBrowser__: "false"
        })
    ]
};

// const config = {
//     bail: true,
//     cache: false,
//     devtool: production ? false : 'eval-source-map',
//     context: __dirname + '/',
//     //entry: ['@babel/polyfill', './src/js/main.js', './src/scss/main.scss'],
//     entry: ['@babel/polyfill', './src/js/client.js', './src/scss/main.scss'],
//     output: {
//         publicPath: '/dist/',
//         path: __dirname + '/dist/',
//         filename: 'bundle.js'
//     },
//     resolve: {
//         extensions: ['.js', '.jsx'],
//         alias: {
//             /*
//                 ensure there is only one instance of react when resolving modules
//                 this helps with symlinks
//             */
//             react: path.join(__dirname, 'node_modules/react'),
//             'react-dom': path.join(__dirname, 'node_modules/react-dom')
//         }
//     },
//     watchOptions: {
//         aggregateTimeout: 600,
//         poll: 1000
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.js$/,
//                 exclude: [/node_modules/],
//                 use: {
//                     loader: 'babel-loader',
//                     options: {
//                         presets: [
//                             '@babel/preset-env',
//                             '@babel/preset-react'
//                         ],
//                         plugins: [[require('@babel/plugin-proposal-decorators'), { legacy: true }]]
//                     }
//                 }
//             },
//             {
//                 test: /\.s?css$/,
//                 use: [
//                     MiniCssExtractPlugin.loader,
//                     {
//                         loader: 'css-loader',
//                         options: {
//                             sourceMap: false,
//                         }
//                     },
//                     {
//                         loader: 'postcss-loader',
//                         options: {
//                             sourceMap: false,
//                             plugins: () => [
//                                 autoprefixer({})
//                             ]
//                         }
//                     },
//                     'resolve-url-loader',
//                     {
//                         loader: 'sass-loader',
//                         options: {
//                             sourceMap: false,
//                             outputStyle: 'compressed'
//                         }
//                     }
//                 ]
//             },
//             {
//                 test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
//                 loader: 'url-loader',
//                 options: {
//                     limit: 10000
//                 }
//             }
//         ]
//     },
//     plugins: [
//         new MiniCssExtractPlugin({
//             filename: `bundle.css`
//         })
//     ]
// };

if (production) {
    const uglifyPlugin = new UglifyJsPlugin({
        sourceMap: false,
        parallel: true,
        uglifyOptions: {
            beautify: false,
            mangle: false,
            compress: false
        }
    });

    const definePlugin = new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
    });

    browserConfig.plugins.push(uglifyPlugin);
    browserConfig.plugins.push(definePlugin);

    serverConfig.plugins.push(uglifyPlugin);
    serverConfig.plugins.push(definePlugin);

    // config.plugins.push(
    //     new UglifyJsPlugin({
    //         sourceMap: false,
    //         parallel: true,
    //         uglifyOptions: {
    //             beautify: false,
    //             mangle: false,
    //             compress: false
    //         }
    //     })
    // );
    // config.plugins.push(
    //     new webpack.DefinePlugin({
    //         'process.env.NODE_ENV': JSON.stringify('production')
    //     })
    // );
}

module.exports = [
    browserConfig,
    serverConfig
];
