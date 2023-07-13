import multer from 'multer';
import { createFileName } from '../../common';

const uploadParser = (path: string, fieldName: string = 'file', multiple: boolean = false) => {
    const storage = multer.diskStorage({
        destination: (request, file, cb) => {
            cb(null, path);
        },
        filename: (request, file, cb) => {
            cb(null, createFileName(file));
        },
    });

    if (multiple) {
        return multer({ storage }).array(fieldName);
    }

    return multer({ storage }).single(fieldName);
};

export default uploadParser;
