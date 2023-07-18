import roundTo from './roundTo';

/**
 * Convert bytes into KB/MB, etc
 * @param bytes
 * @param precision
 */
export default function formatFileSize(bytes: number, precision = 2) {
    const modes = [
        'B', // byte
        'KB', // kilobyte
        'MB', // megabyte
        'GB', // gigabyte
        'TB', // terabyte
        'PB', // petabyte
        'EB', // exabyte
        'ZB', // zettabyte
        'YB', // yottabyte
    ];

    let b = Math.max(bytes, 0);
    // let pow = Math.floor((b ? Math.log(b) : 0) / Math.log(1024));

    // pow = Math.min(pow, modes.length - 1);
    const pow = Math.min(Math.floor((b ? Math.log(b) : 0) / Math.log(1024)), modes.length - 1);

    b /= (1 << (10 * pow));

    return `${roundTo(b, precision)} ${modes[pow]}`;
}
