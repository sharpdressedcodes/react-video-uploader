module.exports = {
    'extends': [
        'stylelint-config-standard-scss',
    ],
    rules: {
        // Selector class pattern must match [BEM CSS](https://en.bem.info/methodology/css)
        // [Regex](https://regexr.com/3apms)
        'selector-class-pattern': [
            '^[a-z]([-]?[a-z0-9]+)*(__[a-z0-9]([-]?[a-z0-9]+)*)?(--[a-z0-9]([-]?[a-z0-9]+)*)?$',
            {
                // This option will resolve nested selectors with & interpolation.
                // https://stylelint.io/user-guide/rules/selector-class-pattern/#resolvenestedselectors-true--false-default-false
                resolveNestedSelectors: true,
                message: function expected(selectorValue) {
                    return `Expected class selector "${selectorValue}" to match BEM CSS pattern https://en.bem.info/methodology/css. Selector validation tool: https://regexr.com/3apms`;
                },
            },
        ],
        'scss/comment-no-empty': null,
        'scss/double-slash-comment-empty-line-before': null,
    },
};
