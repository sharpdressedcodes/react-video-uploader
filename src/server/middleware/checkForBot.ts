import { RequestHandler } from 'express';

const rx = new RegExp([
    'Googlebot',
    'Mediapartners-Google',
    'AdsBot-Google',
    'googleweblight',
    'Storebot-Google',
    'Google-PageRenderer',
    'Bingbot',
    'BingPreview',
    'Slurp',
    'DuckDuckBot',
    'baiduspider',
    'yandex',
    'sogou',
    'LinkedInBot',
    'bitlybot',
    'tumblr',
    'vkShare',
    'quora link preview',
    'facebookexternalhit',
    'facebookcatalog',
    'Twitterbot',
    'applebot',
    'redditbot',
    'Slackbot',
    'Discordbot',
    'WhatsApp',
    'SkypeUriPreview',
    'ia_archiver',
].join('|'), 'i');

const checkForBot: RequestHandler = (req, res, next) => {
    const ua = req.header('user-agent') ?? '';
    let result = false;

    if (ua) {
        result = rx.test(ua);
    }

    req.app.locals.isBot = result;
    next();
};

export default checkForBot;
