module.exports = {
    verbose: true,
    // "collectCoverage": true,
    collectCoverageFrom: [
        './src/js/**/*.{js,jsx}',
        '!./src/js/**/node_modules/**',
    ],
    coverageDirectory: './tests/unit/coverage',
    moduleNameMapper: {
        '\\.(css|scss)$': '<rootDir>/tests/unit/__mocks__/styleMock.js',
    },
    setupFilesAfterEnv: ['<rootDir>tests/unit/helpers/bootstrap.js'],
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        url: 'http://localhost:3000/',
    },
};
