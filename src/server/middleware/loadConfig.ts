import { RequestHandler } from 'express';
import mainConfig, { testConfig } from '../../config';

const isTesting = Boolean(process.env.TEST);

const loadConfig: RequestHandler = (req, res, next) => {
    req.app.locals.isTesting = isTesting || (req.cookies && req.cookies.IS_TESTING === '1');
    req.app.locals.config = req.app.locals.isTesting ? testConfig : mainConfig;

    next();
};

export default loadConfig;
