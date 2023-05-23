const logErrors = (err, req, res, next) => {
    // eslint-disable-next-line no-console
    console.error(err);
    next(err);
};

module.exports = logErrors;
