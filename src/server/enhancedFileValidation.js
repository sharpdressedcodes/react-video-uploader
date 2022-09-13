import { fileValidation, getFileName } from '../common';
import validateFileSignature from './validateFileSignature';

const enhancedFileValidation = async ({
    files = [], allowedFileTypes = {}, allowedFileExtensions = [], maxFiles = 0, maxFileSize = 0, maxTotalFileSize = 0
}) => {
    const customValidator = file => new Promise((resolve, reject) => {
        (async () => {
            try {
                const filesToCheck = Array.isArray(file) ? file : [file];
                const promises = filesToCheck.map(item => validateFileSignature(item, allowedFileTypes));
                const result = (await Promise.all(promises)).reduce((acc, curr, index) => {
                    if (!curr) {
                        return {
                            ...acc,
                            [index]: [`Error: ${getFileName(filesToCheck[index])} is an invalid file`]
                        };
                    }

                    return { ...acc };
                }, {});

                resolve(result);
            } catch (err) {
                reject(err);
            }
        })();
    });

    return fileValidation({ files, customValidator, allowedFileExtensions, maxFiles, maxFileSize, maxTotalFileSize });
};

export default enhancedFileValidation;
