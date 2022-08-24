export function roundTo(bytes, precision) {
    return +(`${Math.round(`${bytes}e+${precision}`)}e-${precision}`);
}
/**
 * Convert bytes into KB/MB, etc
 * @param bytes
 * @param precision
 */
export function formatFileSize(bytes, precision = 2) {
    const modes = ['B', 'KB', 'MB', 'GB', 'TB'];

    let b = Math.max(bytes, 0);
    let pow = Math.floor((b ? Math.log(b) : 0) / Math.log(1024));

    pow = Math.min(pow, modes.length - 1);
    b /= (1 << (10 * pow));

    return `${roundTo(b, precision)} ${modes[pow]}`;
}
