import globals from 'globals';
import babel from '@babel/eslint-plugin';
import destructuring from 'eslint-plugin-destructuring';
import importPlugin from 'eslint-plugin-import';
import a11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import { configs } from 'eslint-config-airbnb-extended/legacy';

const customConfig = {
    ...configs.react.recommended[0],
    ...configs.react.typescript[0],
    files: ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.ts', '**/*.cts', '**/*.mts', '**/*.tsx', '**/*.d.ts'],
    settings: {
        react: {
            version: 'detect',
        },
    },
    plugins: {
        '@babel': babel,
        destructuring,
        'import': importPlugin,
        'jsx-a11y': a11y,
        react,
        'react-hooks': reactHooks,
        '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
        ecmaVersion: 'latest',
        globals: {
            ...globals.browser,
            ...globals.node,
            expect: true,
            Promise: true,
        },
        parser: tsParser,
        parserOptions: {
            project: './tsconfig.eslint.json',
            //project: true,
            //tsconfigRootDir: import.meta.dirname,
        },
        sourceType: 'module',
    },
    rules: {
        '@babel/new-cap': 'error',
        '@babel/no-invalid-this': 'error',
        '@babel/no-unused-expressions': 0,
        '@babel/object-curly-spacing': 0,
        '@babel/semi': 'error',
        // The @typescript-eslint/comma-dangle rule was available in older versions of the plugin 
        // (e.g., v5) but was removed in v6.0.0. The functionality has been merged back into the 
        // core ESLint comma-dangle rule, which can now handle TypeScript syntax correctly, 
        // including enums, generics, and tuples, when using @typescript-eslint/parser.
        //
        // '@typescript-eslint/comma-dangle': ['error', {
        //     'arrays': 'always-multiline',
        //     'objects': 'always-multiline',
        //     'imports': 'always-multiline',
        //     'exports': 'always-multiline',
        //     'functions': 'always-multiline',
        //     // @typescript-eslint options
        //     'enums': 'always-multiline',
        //     // Disabled generics because it gives errors in tsx files with <T,>
        //     'generics': 'ignore',
        //     'tuples': 'always-multiline'
        // }],
        '@typescript-eslint/indent': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-unused-vars': 0,
        '@typescript-eslint/no-var-requires': 0,
        'arrow-parens': ['error', 'as-needed'],
        // Disabled for '@typescript-eslint/comma-dangle'
        'comma-dangle': 'off',
        'import/first': 0,
        'import/newline-after-import': ['error', { count: 1 }],
        'import/no-cycle': 0,
        'import/prefer-default-export': 0,
        'implicit-arrow-linebreak': 0,
        indent: ['error', 4, { ignoredNodes: ['ConditionalExpression'], SwitchCase: 1 }],
        'jsx-a11y/click-events-have-key-events': 0,
        'max-len': [
            'error',
            {
                code: 150,
                ignoreComments: true,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true
            }
        ],
        'no-bitwise': 0,
        'no-console': 'warn',
        'no-plusplus': 0,
        'no-restricted-exports': 0,
        'no-restricted-syntax': [
            'error',
            {
                selector: 'ForInStatement',
                message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.'
            },
            {
                selector: 'LabeledStatement',
                message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.'
            },
            {
                selector: 'WithStatement',
                message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimise.'
            }
        ],
        'no-trailing-spaces': ['error', { ignoreComments: true }],
        // It is safe to disable this rule when using TypeScript because 
        // TypeScript's compiler enforces this check.
        'no-undef': 0,
        'no-unused-vars': 0,
        'no-void': 0,
        'object-curly-newline': 0,
        'operator-linebreak': ['error', 'after'],
        'padded-blocks': ['error', 'never', { allowSingleLineBlocks: false }],
        'padding-line-between-statements': [
            'error',
            { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
            { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] }
        ],
        'prefer-destructuring': 0,
        'quote-props': ['error', 'as-needed', { keywords: true, numbers: true }],
        quotes: [
            'error',
            'single',
            { avoidEscape: true, allowTemplateLiterals: true }
        ],
        'react/destructuring-assignment': 0,
        'react/function-component-definition': 0,
        'react/forbid-prop-types': ['error', { forbid: ['any'] }],
        'react/jsx-curly-spacing': ['error', { when: 'always' }],
        'react/jsx-filename-extension': 0,
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/jsx-one-expression-per-line': 0,
        'react/jsx-no-target-blank': 0,
        'react/jsx-props-no-spreading': 0,
        'react/no-danger': 0,
        'react/static-property-placement': ['error', 'static public field'],
        'react/sort-comp': [2, {
            order: [
                'type-annotations',
                'static-variables',
                'static-methods',
                'getters',
                'setters',
                'lifecycle',
                'instance-variables',
                'instance-methods',
                'everything-else',
                'render',
            ],
            groups: {
                // split your render method into smaller ones and keep them just before render
                rendering: [
                    '/^render.+$/',
                    'render',
                ],
            },
        }],
        'semi-style': 0,
        strict: 0,
    },
};

export default [
    customConfig,
    {
        ignores: [
            './.idea/**',
            './.vscode/**',
            './.github/**',
            './.husky/**',
            './build/**',
            './docker/**',
            './hooks/**',
            './node-cache/**',
            './tests/e2e/screenshots/**',
            './tests/e2e/reports/**',
            './tests/e2e/results/**',
            '**/*.json',
        ],
    },
];
