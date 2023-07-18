// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig, devices } from '@playwright/test';

const baseURL = `http://localhost:${process.env.PORT || 3000}`;

export default defineConfig({
    // Look for test files in the "tests" directory, relative to this configuration file.
    testDir: './tests/e2e/integration',
    fullyParallel: true,
    // Fail the build on CI if you accidentally left test.only in the source code.
    forbidOnly: !!process.env.CI,
    maxFailures: process.env.CI ? 1 : 0,
    retries: process.env.CI ? 3 : 2,
    timeout: 10 * 1000, // 10 seconds
    globalTimeout: process.env.CI ? 60 * 60 * 1000 : undefined,
    outputDir: './tests/e2e/results',
    preserveOutput: 'failures-only',
    snapshotPathTemplate: './tests/e2e/screenshots/{testFilePath}/{arg}{ext}',
    workers: process.env.CI ? 1 : undefined,
    reporter: [['html', { open: 'never', outputFolder: './tests/e2e/reports' }]],
    use: {
        // Base URL to use in actions like `await page.goto('/')`.
        baseURL,
        // Collect trace when retrying the failed test.
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: devices['Desktop Chrome'],
        },
        {
            name: 'firefox',
            use: devices['Desktop Firefox'],
        },
        {
            name: 'webkit',
            use: devices['Desktop Safari'],
        },
        {
            name: 'Mobile Chrome',
            use: devices['Pixel 5'],
        },
        // {
        //     name: 'Mobile Safari',
        //     use: devices['iPhone 12'],
        // },
    ],
    webServer: {
        // command: 'cross-env DEBUG=pw:webserver TEST=true npm run start',
        command: 'cross-env DEBUG=pw:webserver TEST=true npm run build && npm run start',
        reuseExistingServer: !process.env.CI,
        stderr: 'pipe',
        stdout: 'pipe',
        url: baseURL,
    },
});
