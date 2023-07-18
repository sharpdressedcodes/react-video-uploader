import { RequestHandler } from 'express';

const insecureHeaders = [
    'X-Powered-By',
    'server',
    'Server',
];
const secureHeaders = {
    // Below 4 are handled by cors package
    // 'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Requested-With,X-CSRF-Token',
    // // 'Access-Control-Allow-Methods': 'DELETE,HEAD,GET,OPTIONS,PATCH,POST,PUT',
    // 'Access-Control-Allow-Methods': 'HEAD,GET,OPTIONS,POST',
    // 'Access-Control-Allow-Origin': '*',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; style-src-elem 'self' 'unsafe-inline'; img-src 'self' * data:; font-src 'self' data: ; connect-src 'self'; media-src 'self'; frame-src 'self'; object-src 'none'; base-uri 'self';",
    // Deprecated
    // 'Expect-CT': 'enforce, max-age=30',
    'Permissions-Policy': 'autoplay=(self), camera=(), encrypted-media=(self), fullscreen=(), geolocation=(self), gyroscope=(self), magnetometer=(), microphone=(), midi=(), payment=(), sync-xhr=(self), usb=()',
    'Referrer-Policy': 'no-referrer-when-downgrade',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
};
const securityHeaders: RequestHandler = (req, res, next) => {
    insecureHeaders.forEach(key => {
        res.removeHeader(key);
    });

    Object.entries(secureHeaders).forEach(([key, value]) => {
        res.header(key, value);
    });

    next();
};

export default securityHeaders;
