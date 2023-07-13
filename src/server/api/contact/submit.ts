import { Express, RequestHandler } from 'express';
import { unlink } from '../../utils/fileSystem';
import { isArrayEmpty, isObjectEmpty } from '../../../common';
import validateFormFile from '../../../common/validation/validateFormFile';
import validateFormInput from '../../../common/validation/validateFormInput';
// import { ConfigType } from '../../../config';
import componentConfig from '../../../components/pages/ContactPage/config';
import { BaseFormMessageType } from '../../../components/Form';

type ExpressFile = Express.Multer.File;

const isProduction = process.env.NODE_ENV === 'production';

const handleContactSubmit: RequestHandler = async (req, res, next) => {
    try {
        // const config: ConfigType = req.app.locals.config;
        // const uploadPath = config.contactUpload.path;
        const files = Array.from(req.files as ExpressFile[]);
        const validateEmail = () => validateFormInput(req.body.email ?? '', componentConfig.email.rules!);
        const validateMessage = () => validateFormInput(req.body.message ?? '', componentConfig.message.rules!);
        const validateFiles = () => validateFormFile(files, componentConfig.files.rules!);
        const validateForm = (): BaseFormMessageType => ({
            email: validateEmail(),
            message: validateMessage(),
            files: validateFiles(),
        });

        const validationResult = validateForm();
        const hasEmailErrors = !isArrayEmpty(validationResult.email);
        const hasMessageErrors = !isArrayEmpty(validationResult.message);
        const hasFileErrors = !isObjectEmpty(validationResult.files);

        if (hasEmailErrors ||
            hasMessageErrors ||
            hasFileErrors) {
            if (hasFileErrors) {
                await Promise.all(files.map(file => unlink(file.path)));
            }

            res.json({ errors: validationResult });
            return;
        }

        // For now just delete the files, without sending any emails.
        const result = await Promise.all(files.map(file => unlink(file.path)));

        res.json({ success: true });

        if (!isProduction) {
            // eslint-disable-next-line no-console
            console.log(`Received ${files.length} files`, files, result);
        }
    } catch (err) {
        next(err);
    }
};

export default handleContactSubmit;
