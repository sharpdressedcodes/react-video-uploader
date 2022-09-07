/**
 * isArrayEmpty
 * An O(1) implementation to see if an array is empty
 *
 * @param array the Array to check
 * @returns {boolean} true If the array is empty, false otherwise
 */
const isArrayEmpty = array => {
    try {
        // eslint-disable-next-line no-restricted-syntax, no-unreachable-loop
        for (const k of array) {
            return false;
        }
    } catch {
        // Do nothing
    }

    return true;
};

export default isArrayEmpty;
