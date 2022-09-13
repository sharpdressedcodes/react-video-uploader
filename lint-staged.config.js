// eslint-disable-next-line import/no-extraneous-dependencies
const micromatch = require('micromatch');

module.exports = allStagedFiles => {
    const codeFiles = micromatch(allStagedFiles, ['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.ts']);
    const markdownFiles = micromatch(allStagedFiles, ['**/*.md']);
    const styleFiles = micromatch(allStagedFiles, ['**/*.scss', '**/*.css']);
    const linters = [];

    // if (markdownFiles?.length) {
    //     console.log('Found markdownFiles for linting', markdownFiles);
    //     linters.push(`npm run lint:md:staged -- ${markdownFiles.join(' ')}`);
    // }
    //
    // if (codeFiles?.length) {
    //     console.log('Found codeFiles for linting', codeFiles);
    //     linters.push(`npm run lint:js:staged -- ${codeFiles.join(' ')}`);
    // }
    //
    // if (styleFiles?.length) {
    //     console.log('Found styleFiles for linting', styleFiles);
    //     linters.push(`npm run lint:scss:staged -- ${styleFiles.join(' ')}`);
    // }

    return linters;
    // return [
    //     `npm run lint:md:staged -- ${markdownFiles.join(' ')}`,
    //     `npm run lint:js:staged -- ${codeFiles.join(' ')}`,
    //     `npm run lint:scss:staged -- ${styleFiles.join(' ')}`
    // ];
};
