
function roundTo(bytes, precision) {
    return +(Math.round(bytes + "e+" + precision) + "e-" + precision);
}
/**
 * Convert bytes into KB/MB, etc
 * @param bytes
 * @param precision
 */
function formatFileSize(bytes, precision = 2) {

    const modes = ['B', 'KB', 'MB', 'GB', 'TB'];

    bytes = Math.max(bytes, 0);
    let pow = Math.floor((bytes ? Math.log(bytes) : 0) / Math.log(1024));
    pow = Math.min(pow, modes.length - 1);
    bytes /= (1 << (10 * pow));

    return roundTo(bytes, precision) + ' ' + modes[pow];
}

module.exports = {
    roundTo,
    formatFileSize
};
