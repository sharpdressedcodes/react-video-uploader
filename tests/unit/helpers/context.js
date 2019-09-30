const PropTypes = require('prop-types');
const { mount, shallow } = require('enzyme');
const config = require('../../../src/js/config/main');

const shallowWithContext = (node, cfg = config) => {
    const context = {
        executeAction: () => {},
        getStore: (store) => {
            return {
                on: () => {}
            };
        },
        config: cfg
    };

    const options = {
        context,
        childContextTypes: {
            executeAction: PropTypes.func,
            getStore: PropTypes.func,
            config: PropTypes.object
        }
    };
    return shallow(node, options);
};

const mountWithContext = (node, cfg = config) => {
    const context = {
        executeAction: () => {},
        getStore: (store) => {
            return {
                on: () => {}
            };
        },
        config: cfg
    };

    const options = {
        context,
        childContextTypes: {
            executeAction: PropTypes.func,
            getStore: PropTypes.func,
            config: PropTypes.object
        }
    };
    return mount(node, options)
};

module.exports = {
    shallowWithContext,
    mountWithContext
};


