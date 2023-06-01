import { RequestHandler } from 'express';

const injectCsrf: RequestHandler = (req, res, next) => {
    res.cookie('csrfToken', req.csrfToken ? req.csrfToken() : null, { sameSite: true, httpOnly: true });
    next();
};

export default injectCsrf;
