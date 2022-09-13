// eslint-disable-next-line import/no-extraneous-dependencies
const micromatch = require('micromatch');

// Stylelint doesn't end properly when there are no files given.
// Only run linters when there are actual files that have changed.
module.exports = allStagedFiles => {
    const codeFiles = micromatch(allStagedFiles, ['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.ts']);
    const markdownFiles = micromatch(allStagedFiles, ['**/*.md']);
    const styleFiles = micromatch(allStagedFiles, ['**/*.scss', '**/*.css']);
    const linters = [
        markdownFiles?.length ? `npm run lint:md:staged -- ${markdownFiles.join(' ')}` : [],
        codeFiles?.length ? `npm run lint:js:staged -- ${codeFiles.join(' ')}` : [],
        styleFiles?.length ? `npm run lint:scss:staged -- ${styleFiles.join(' ')}` : []
    ].flat();

    console.log('linters', linters);

    // if (markdownFiles?.length) {
    //     linters.push(`npm run lint:md:staged -- ${markdownFiles.join(' ')}`);
    // }
    //
    // if (codeFiles?.length) {
    //     linters.push(`npm run lint:js:staged -- ${codeFiles.join(' ')}`);
    // }
    //
    // if (styleFiles?.length) {
    //     linters.push(`npm run lint:scss:staged -- ${styleFiles.join(' ')}`);
    // }

    return linters;
};
