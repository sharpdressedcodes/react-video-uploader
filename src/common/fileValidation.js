import FileValidator from './FileValidator';
import FilesValidator from './FilesValidator';
import isArrayEmpty from './isArrayEmpty';

const fileValidation = async ({
    allowedFileExtensions = [], customValidator = null, files = [], maxFiles = 0, maxFileSize = 0, maxTotalFileSize = 0
}) => {
    const filesValidator = new FilesValidator({ files, maxFiles, maxTotalFileSize });
    const fileErrors = {};
    const overallErrors = [];
    const validFiles = [];
    const invalidFiles = [];
    const fileValidations = files.map(file => new Promise(resolve => {
        (async () => {
            try {
                const validator = new FileValidator({ file, maxFileSize, allowedFileExtensions });

                if (!await validator.validate(customValidator)) {
                    resolve(validator.validationErrors);
                    return;
                }

                resolve([]);
            } catch (err) {
                resolve([err.message]);
            }
        })();
    }));
    let success = true;

    try {
        if (!await filesValidator.validate()) {
            overallErrors.push(...filesValidator.validationErrors);
            success = false;
        }

        const validationResults = await Promise.all(fileValidations);
        const { errors, valid, invalid } = validationResults.reduce((acc, curr, index) => {
            if (!isArrayEmpty(curr)) {
                return {
                    ...acc,
                    errors: {
                        ...acc.errors,
                        [index]: curr
                    },
                    invalid: [
                        ...acc.invalid,
                        files[index]
                    ]
                };
            }

            return { ...acc, valid: [...acc.valid, files[index]] };
        }, { errors: {}, valid: [], invalid: [] });

        validFiles.push(...valid);
        invalidFiles.push(...invalid);

        if (!isArrayEmpty(invalid)) {
            Object.assign(fileErrors, errors);
            success = false;
        }
    } catch (err) {
        overallErrors.push(...err.message);
        success = false;
    }

    return { fileErrors, overallErrors, validFiles, invalidFiles, success };
};

export default fileValidation;
