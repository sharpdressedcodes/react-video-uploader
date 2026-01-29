#!/usr/bin/env node
/* eslint-disable no-console */
import { spawn } from 'node:child_process';

//const isCi = process.env.CI !== undefined;
const isDocker = process.env.IS_DOCKER !== undefined;

const onStdOut = data => {
    console.log(data);
};

const onStdErr = data => {
    console.error(`Error installing Playwright: ${data}`);
};

const onClose = code => {
    if (code) {
        console.error(`Playwright installation failed with code ${code}`);
    }
};

// Docker image has deps preinstalled
if (!isDocker) {
    const child = spawn('npx', ['playwright', 'install', '--with-deps']);

    child.stdout.on('data', onStdOut);
    child.stderr.on('data', onStdErr);
    child.on('close', onClose);
}
