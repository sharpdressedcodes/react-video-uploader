import getFileExtension from './getFileExtension';
import isArrayEmpty from './isArrayEmpty';

const validateFileExtension = (file, allowedFileExtensions = []) => {
    const fileExtension = getFileExtension(file);

    if (!isArrayEmpty(allowedFileExtensions) && fileExtension) {
        return Boolean(allowedFileExtensions.find(ext => ext.toLowerCase() === fileExtension.toLowerCase()));
    }

    // No extensions means allow everything
    return true;
};

export default validateFileExtension;
