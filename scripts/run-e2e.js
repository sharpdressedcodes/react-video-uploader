#!/usr/bin/env node

// eslint-disable-next-line import/no-extraneous-dependencies
const concurrently = require('concurrently');
const axios = require('axios');

const STATUS_OK = 200;
const APP_URL = `http://localhost:${process.env.PORT || 3000}/`;

// Make sure the app is running before the tests.
(async args => {
    if (!args.length) {
        // eslint-disable-next-line no-console
        console.error('Error: No commands to run, please give a command');
        return;
    }

    const [command] = args;
    let shouldRunApp = false;

    try {
        const result = await axios.get(APP_URL);

        if (result.status !== STATUS_OK) {
            shouldRunApp = true;
        }
    } catch {
        shouldRunApp = true;
    }

    try {
        if (shouldRunApp) {
            // Run app, then run tests.
            // The tests will exit with code 0. That will trigger concurrently to stop the app.
            const { result } = concurrently([
                `concurrently --success first --kill-others --names "app,e2e" -c "bgBlue.bold,bgCyan.bold" "npm run build && npm run start" "wait-on ${APP_URL} && ${command}"`
            ]);

            await result;
            return;
        }

        // Run command without running app (it should already be running).
        const { result } = concurrently([command]);

        await result;
    } catch {
        //
    }
})(process.argv.slice(2));
