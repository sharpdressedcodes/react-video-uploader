const fs = require('node:fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const micromatch = require('micromatch');

const cwd = process.cwd();
// const esConfigFileName = './.eslint-staged-rc';
const tsConfigFileName = './tsconfig.lint-staged.json';
const isArrayEmpty = arr => {
    try {
        // eslint-disable-next-line no-restricted-syntax, no-unreachable-loop
        for (const k of arr) {
            return false;
        }
    } catch {
        // Do nothing
    }

    return true;
};
const isValid = arr => Array.isArray(arr) && !isArrayEmpty(arr);
const generateTsConfig = files => {
    const include = (files.includes(`${cwd}/custom.d.ts`) ? files : [
        ...files,
        'custom.d.ts',
    ]).map(file => file.replace(`${cwd}/`, './'));
    const json = {
        'extends': './tsconfig.json',
        include,
        exclude: [
            '.idea',
            '.vscode',
            '.github',
            '.husky',
            'build',
            'cypress-cache',
            'docker',
            'hooks',
            'server',
            '**/node_modules/**',
            './tsconfig.lint-staged.json',
        ],
    };

    fs.writeFileSync(tsConfigFileName, JSON.stringify(json));
};
// const generateEsConfig = () => {
//     const content = fs
//         .readFileSync('./.eslintrc')
//         .toString()
//         .replace('"project": "./tsconfig.eslint.json"', `"project": "${tsConfigFileName}"`)
//     ;
//
//     fs.writeFileSync(esConfigFileName, content);
// };

// Stylelint doesn't end properly when there are no files given.
// Only run linters when there are actual files that have changed.
module.exports = allStagedFiles => {
    const codeFiles = micromatch(allStagedFiles, ['**/*.{mjs,cjs,js,jsx,ts,tsx}']);
    // const tsCodeFiles = micromatch(allStagedFiles, ['**/*.{ts,tsx}']);
    const markdownFiles = micromatch(allStagedFiles, ['**/*.md']);
    const styleFiles = micromatch(allStagedFiles, ['**/*.{css,sass,scss}']);
    const yamlFiles = micromatch(allStagedFiles, ['**/*.{yml,yaml}']);

    // Note: eslint uses the `fix` option, so in order to prevent a race condition,
    // we need to run eslint and tsc in the same command.
    // Let eslint `fix` the files first, then let tsc check them.
    let codeCommand = '';
    const codeCommands = [];

    if (isValid(codeFiles)) {
        // let customConfig = '';
        const customConfig = `--parser-options project:${tsConfigFileName} --parser-options tsconfigRootDir:${cwd}`;

        // if (isValid(tsCodeFiles)) {
        // customConfig = `--config ${esConfigFileName}`;
        // customConfig = `--parser-options project:${tsConfigFileName}`;
        // }
        const mapped = codeFiles
            .map(file => file.replace(`${cwd}/`, './'))
            .filter(file => !file.endsWith('tsconfig.lint-staged.json'))
        ;

        codeCommands.push(`npm run lint:js:staged -- ${customConfig} ${mapped.join(' ')}`);
        // }

        // if (isValid(tsCodeFiles)) {
        //     generateTsConfig(tsCodeFiles);
        generateTsConfig(mapped);
        // codeCommands.push(`npm run lint:ts -- --project ${tsConfigFileName} && rimraf ${tsConfigFileName}`);
        codeCommands.push(`npm run lint:ts -- --project ${tsConfigFileName}`);
    }

    if (!isArrayEmpty(codeCommands)) {
        codeCommand = codeCommands.join(' && ');
    }

    return [
        codeCommand,
        isValid(styleFiles) && `npm run lint:scss:staged -- ${styleFiles.join(' ')}`,
        isValid(markdownFiles) && `npm run lint:md:staged -- ${markdownFiles.join(' ')}`,
        isValid(yamlFiles) && `npm run lint:yml:staged -- ${yamlFiles.join(' ')}`,
    ].filter(Boolean);
};
