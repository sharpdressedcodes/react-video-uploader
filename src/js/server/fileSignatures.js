/**
 *
 * Signature can be an object, or an array of objects
 *
 * Position can be either 'start' or 'end'
 */
const signatures = {
    mp4: {
        // Ignore first 4 bytes, only check the next 4
        position: 'start',
        length: 8,
        check(str) {
            return str.endsWith('ftyp');
        },
    },
};

export default signatures;
