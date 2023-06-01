module.exports = {
    verbose: true,
    // "collectCoverage": true,
    collectCoverageFrom: [
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    coverageDirectory: './tests/unit/coverage',
    moduleNameMapper: {
        '\\.(css|scss)$': '<rootDir>/tests/unit/__mocks__/styleMock.js',
    },
    setupFilesAfterEnv: [
        '@testing-library/jest-dom',
        '<rootDir>tests/unit/helpers/bootstrap.ts',
    ],
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        url: 'http://localhost:3000/',
    },
};
