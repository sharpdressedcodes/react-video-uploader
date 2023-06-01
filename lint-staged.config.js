const fs = require('node:fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const micromatch = require('micromatch');

const cwd = process.cwd();
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
const findDefinitionFile = () => {
    const files = fs.readdirSync(cwd);
    const match = files.find(file => file.toLowerCase().endsWith('.d.ts'));

    return !match ? match : match?.replace(`${cwd}/`, '');
};
const generateTsConfig = files => {
    const definitionFile = findDefinitionFile() ?? '';
    const include = (files.includes(`${cwd}/${definitionFile}`) ? files : [
        ...files,
        definitionFile,
    ]).map(file => file.replace(`${cwd}/`, './'));
    const json = {
        'extends': './tsconfig.json',
        include,
    };

    fs.writeFileSync(tsConfigFileName, JSON.stringify(json));
};

// Stylelint doesn't end properly when there are no files given.
// Only run linters when there are actual files that have changed.

// Note: eslint uses the `fix` option, so in order to prevent a race condition,
// we need to run eslint and tsc in the same command.
// Let eslint `fix` the files first, then let tsc check them.
module.exports = allStagedFiles => {
    const codeFiles = micromatch(allStagedFiles, ['**/*.{mjs,cjs,js,jsx,ts,tsx}']);
    const markdownFiles = micromatch(allStagedFiles, ['**/*.md']);
    const styleFiles = micromatch(allStagedFiles, ['**/*.{css,sass,scss}']);
    const yamlFiles = micromatch(allStagedFiles, ['**/*.{yml,yaml}']);
    let codeCommand = '';

    if (isValid(codeFiles)) {
        const codeCommands = [];
        const customConfig = `--parser-options project:${tsConfigFileName} --parser-options tsconfigRootDir:${cwd}`;
        const mapped = codeFiles.map(file => file.replace(`${cwd}/`, './'));

        generateTsConfig(mapped);

        codeCommands.push(`npm run lint:js:staged -- ${customConfig} ${mapped.join(' ')}`);
        codeCommands.push(`npm run lint:ts -- --project ${tsConfigFileName}`);
        codeCommands.push(`rimraf ${tsConfigFileName}`);

        codeCommand = codeCommands.join(' ; ');
    }

    return [
        codeCommand,
        isValid(styleFiles) && `npm run lint:scss:staged -- ${styleFiles.join(' ')}`,
        isValid(markdownFiles) && `npm run lint:md:staged -- ${markdownFiles.join(' ')}`,
        isValid(yamlFiles) && `npm run lint:yml:staged -- ${yamlFiles.join(' ')}`,
    ].filter(Boolean);
};
