#!/usr/bin/env node

const isCi = process.env.CI !== undefined;
const isDocker = process.env.IS_DOCKER !== undefined;

if (!isCi && !isDocker) {
    // eslint-disable-next-line global-require
    require('husky').install();
}

process.exit(0);
