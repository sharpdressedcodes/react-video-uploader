module.exports = api => ({
    parserOpts: {
        esModuleInterop: true,
        strictMode: true,
    },
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current',
                    browsers: ['last 2 versions', '> 0.25%', 'not dead'],
                },
            },
        ],
        [
            '@babel/preset-react',
            {
                development: !api.env('production'),
                runtime: 'automatic',
                pure: true,
                useBuiltIns: true,
            },
        ],
        ['@babel/preset-typescript'],
    ],
    plugins: [
        !api.env('production') && process.env.FAST_REFRESH === 'true' && 'react-refresh/babel',
        // Make sure that @babel/plugin-proposal-destructuring-private comes before @babel/plugin-proposal-class-properties.
        '@babel/plugin-proposal-destructuring-private',
        // Make sure that @babel/plugin-proposal-decorators comes before @babel/plugin-proposal-class-properties.
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        ['@babel/plugin-transform-runtime', { regenerator: true }],
    ].filter(Boolean),
    sourceType: 'unambiguous',
});
