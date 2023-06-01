import { ErrorRequestHandler } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

const logErrors: ErrorRequestHandler = (err, req, res, next) => {
    if (!isProduction) {
        // eslint-disable-next-line no-console
        console.error(err);
    }

    next(err);
};

export default logErrors;
