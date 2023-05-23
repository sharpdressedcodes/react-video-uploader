const path = require('node:path');

const isProduction = process.env.NODE_ENV === 'production';

const render = async (req, res, next) => {
    let htmlString;

    try {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const entry = require(path.join(process.cwd(), 'server/server-entry')).default;

        await entry(req, res, next);
    } catch (err) {
        if (!isProduction) {
            // eslint-disable-next-line no-console
            console.error(`Render error: ${err.message}`);
        }

        htmlString = 'Internal Error';
    }

    return htmlString;
};

module.exports = render;
