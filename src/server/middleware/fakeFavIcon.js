const fakeFavIcon = (req, res, next) => {
    if (req.url.endsWith('favicon.ico')) {
        res.writeHead(200, { 'Content-Type': 'image/x-icon' });
        res.end();
    } else {
        next();
    }
};

module.exports = fakeFavIcon;
