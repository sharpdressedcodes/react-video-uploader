if (typeof globalThis !== 'undefined') {
    // eslint-disable-next-line no-undef
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
}

process.on('unhandledRejection', err => {
    throw err;
});
