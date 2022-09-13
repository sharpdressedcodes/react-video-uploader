// eslint-disable-next-line import/no-extraneous-dependencies
const micromatch = require('micromatch');

const isValid = arr => Array.isArray(arr) && arr.length;

// Stylelint doesn't end properly when there are no files given.
// Only run linters when there are actual files that have changed.
module.exports = allStagedFiles => {
    const codeFiles = micromatch(allStagedFiles, ['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.ts']);
    const markdownFiles = micromatch(allStagedFiles, ['**/*.md']);
    const styleFiles = micromatch(allStagedFiles, ['**/*.scss', '**/*.css']);
    const yamlFiles = micromatch(allStagedFiles, ['**/*.yml', '**/*.yaml']);

    return [
        isValid(markdownFiles) && `npm run lint:md:staged -- ${markdownFiles.join(' ')}`,
        isValid(codeFiles) && `npm run lint:js:staged -- ${codeFiles.join(' ')}`,
        isValid(styleFiles) && `npm run lint:scss:staged -- ${styleFiles.join(' ')}`,
        isValid(yamlFiles) && `npm run lint:yml:staged -- ${yamlFiles.join(' ')}`
    ].filter(Boolean);
};
