import { RequestHandler } from 'express';

const fakeFavIcon: RequestHandler = (req, res, next) => {
    if (req.url.endsWith('favicon.ico')) {
        res.writeHead(200, { 'Content-Type': 'image/x-icon' });
        res.end();
        return;
    }

    next();
};

export default fakeFavIcon;
