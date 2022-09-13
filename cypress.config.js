// eslint-disable-next-line import/no-extraneous-dependencies
const { defineConfig } = require('cypress');

const testDir = './tests/e2e';
const supportFile = `${testDir}/support/index.js`;

module.exports = defineConfig({
    downloadsFolder: `${testDir}/downloads`,
    fixturesFolder: `${testDir}/fixtures`,
    screenshotsFolder: `${testDir}/screenshots`,
    videosFolder: `${testDir}/videos`,
    video: false,
    component: {
        supportFile,
        setupNodeEvents(on, config) {
            // bind to the event we care about
            // on('task', (arg1, arg2) => {
            //     log(message) { console.log(message); return null; }
            // });
            on('task', {
                log(message) {
                    // eslint-disable-next-line no-console
                    console.log(message);
                    return null;
                }
            });
        }
    },
    e2e: {
        baseUrl: `http://localhost:${process.env.PORT || 3000}`,
        specPattern: `${testDir}/integration/**/*spec.js`,
        supportFile,
        setupNodeEvents(on, config) {
            // bind to the event we care about
            // on('task', (arg1, arg2) => {
            //     log(message) { console.log(message); return null; }
            // });
            on('task', {
                log(message) {
                    // eslint-disable-next-line no-console
                    console.log(message);
                    return null;
                }
            });
        }
    }
});
