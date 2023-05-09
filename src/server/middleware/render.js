const path = require('node:path');

const isProduction = process.env.NODE_ENV === 'production';

const render = async (req, res) => {
    let htmlString;

    try {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const entry = require(path.join(process.cwd(), 'build/server-entry')).default;

        await entry(req, res);
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
