/* eslint-disable no-console */
const fs = require('node:fs/promises');
const path = require('node:path');
const chalk = require('chalk');

const directoryExists = async directory => {
    try {
        const stat = await fs.lstat(directory);

        return stat.isDirectory();
    } catch (err) {
        return false;
    }
};
const fileExists = async file => {
    try {
        const stat = await fs.lstat(file);

        return stat.isFile();
    } catch (err) {
        return false;
    }
};
const convertTitleCaseToHyphenCase = str => {
    const A = 65;
    const Z = 65 + 25;

    return str
        .split('')
        .reduce((acc, curr, index) => {
            const charCode = curr.charCodeAt(0);

            if (charCode >= A && charCode <= Z) {
                return [
                    ...acc,
                    `${index ? '-' : ''}${curr.toLowerCase()}`,
                ];
            }

            return [
                ...acc,
                curr,
            ];
        }, [])
        .join('')
    ;
};
const generateComponent = async (name, componentPath = '') => {
    const p = path.resolve(`./src/components/${componentPath}`);
    const commonPathPrefix = componentPath.split('/').map(() => '../').join('');
    const className = convertTitleCaseToHyphenCase(name);
    const typesIndexData = 'export type DefaultPropsType = {\n    className: string;\n};\n\nexport type PropsType = Partial<DefaultPropsType> & {};\n';
    const componentData = `import React, { memo } from 'react';\nimport { classNames } from '${commonPathPrefix}../../../common';\nimport { DefaultPropsType, PropsType } from '../types';\nimport '../styles/${className}.scss';\n\nexport const defaultProps: DefaultPropsType = {\n    className: '',\n};\n\nconst ${name} = ({\n    className = defaultProps.className,\n}: PropsType) => null;\n\n${name}.displayName = '${name}';\n\nexport default memo<PropsType>(${name});\n`;
    const stylesData = `.${className} {\n    // Enter styles here\n}\n`;
    const indexData = `export { default as ${name}, defaultProps } from './components/${name}';\nexport { DefaultPropsType, PropsType } from './types';\n`;
    const directories = [
        '',
        '/components',
        '/styles',
        '/types',
    ];
    const files = {
        '/index.ts': indexData,
        [`/components/${name}.tsx`]: componentData,
        [`/styles/${className}.scss`]: stylesData,
        '/types/index.ts': typesIndexData,
    };

    try {
        const checkResults = await Promise.all([
            ...directories.map(directory => new Promise((resolve, reject) => {
                (async () => {
                    const dir = `${p}/${name}${directory}`;

                    if (await directoryExists(dir)) {
                        reject(new Error(`Directory ${dir} already exists.`));
                        return;
                    }

                    resolve(true);
                })();
            })),
            ...Object.keys(files).map(file => new Promise((resolve, reject) => {
                (async () => {
                    const f = `${p}/${name}${file}`;

                    if (await fileExists(f)) {
                        reject(new Error(`File ${f} already exists`));
                        return;
                    }

                    resolve(true);
                })();
            })),
        ]);
        const dirResults = await Promise.all(directories.map(directory => fs.mkdir(`${p}/${name}${directory}`, { recursive: true })));
        const fileResults = await Promise.all(Object.entries(files).map(([key, value]) => fs.writeFile(`${p}/${name}${key}`, value)));

        console.log(`Generated component ${chalk.green(name)}`);
    } catch (err) {
        console.error(err);
        return false;
    }

    return true;
};
const parseArgs = args => {
    const result = {};

    args.forEach(arg => {
        let key = '';
        let value = '';
        const pos = arg.indexOf('=');

        if (pos > -1) {
            key = arg.substring(0, pos);
            value = arg.substring(pos + 1);
        } else {
            key = arg;
        }

        // console.log('parsing arg', arg, key, value);

        switch (key.toLowerCase()) {
            case '--component':
            case '-c':
                result.isComponent = true;
                break;

            case '--name':
            case '-n':
                result.name = value;
                break;

            case '--type':
            case '-t':
                result.type = value;
                break;

            case '--path':
            case '-p':
                result.path = value;
                break;

            default:
        }
    });

    return result;
};

// cli --component --name="FormNotes" --type="class|function" --path=Form/components --no-styles

// node ./scripts/cli.js --component --name="FormNotes" --path="Form/components"
(async () => {
    try {
        const args = parseArgs(process.argv.slice(2));

        if (args.isComponent) {
            if (!args.name) {
                console.error('You must specify a component name. Eg: --name=ComponentName');
                process.exit(1);
            }

            const result = await generateComponent(args.name, args.path ?? '');
        }
    } catch (err) {
        console.error(err);
    }
})();
