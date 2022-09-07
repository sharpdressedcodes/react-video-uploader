/**
 * isObjectEmpty
 * An O(1) implementation to see if an object is empty
 *
 * @param obj the Object to check
 * @returns {boolean} true If the object is empty, false otherwise
 */
const isObjectEmpty = obj => {
    try {
        // eslint-disable-next-line guard-for-in, no-restricted-syntax, no-unreachable-loop
        for (const k in obj) {
            return false;
        }
    } catch {
        // Do nothing
    }

    return true;
};

export default isObjectEmpty;
