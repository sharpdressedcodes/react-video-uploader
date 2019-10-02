module.exports = {
    "verbose": true,
    //"collectCoverage": true,
    "collectCoverageFrom": [
        "./src/js/**/*.{js,jsx}",
        "!./src/js/**/node_modules/**"
    ],
    "coverageDirectory": "./tests/unit/coverage",
    "testURL": "http://localhost:3001/",
    "moduleNameMapper": {
        "\\.(css|scss)$": "<rootDir>/tests/unit/__mocks__/styleMock.js",
        "/config/main$": "<rootDir>/tests/unit/__mocks__/configMock.js"
    },
    "setupFilesAfterEnv": ["<rootDir>tests/unit/helpers/bootstrap.js"]
};
