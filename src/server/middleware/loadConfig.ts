import { RequestHandler } from 'express';
import mainConfig, { testConfig } from '../../config';

const isTest = process.env.NODE_ENV === 'test';

const loadConfig: RequestHandler = (req, res, next) => {
    req.app.locals.isTesting = isTest || (req.cookies && req.cookies.IS_TESTING === '1');
    req.app.locals.config = req.app.locals.isTesting ? testConfig : mainConfig;

    next();
};

export default loadConfig;
