import { RequestHandler } from 'express';
import session from 'express-session';

const loadSession = (secret: string): RequestHandler => session({
    secret,
    resave: false,
    saveUninitialized: true,
});

export default loadSession;
