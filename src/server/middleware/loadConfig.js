const { 'default': mainConfig, testConfig } = require('../../config/index.cjs');

const isTest = process.env.NODE_ENV === 'test';

const loadConfig = (req, res, next) => {
    req.app.locals.isTesting = isTest || (req.cookies && req.cookies.IS_TESTING === '1');
    req.app.locals.config = req.app.locals.isTesting ? testConfig : mainConfig;

    next();
};

module.exports = loadConfig;
