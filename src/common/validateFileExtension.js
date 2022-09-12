import getFileExtension from './getFileExtension';
import isArrayEmpty from './isArrayEmpty';

const validateFileExtension = (file, allowedFileExtensions = []) => {
    const fileExtension = getFileExtension(file);

    if (!isArrayEmpty(allowedFileExtensions) && fileExtension) {
        return allowedFileExtensions.includes(fileExtension);
    }

    // No extensions means allow everything
    return true;
};

export default validateFileExtension;
