import { RequestHandler } from 'express';
import { CsrfTokenGenerator, CsrfTokenStorer } from 'csrf-sync';

const storeCsrfInSession = (
    generateToken: CsrfTokenGenerator,
    storeTokenInState: CsrfTokenStorer,
    forceRefresh: boolean = false,
): RequestHandler => (req, res, next) => {
    storeTokenInState(req, generateToken(req, forceRefresh));
    next();
};

export default storeCsrfInSession;
