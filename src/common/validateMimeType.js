import getMimeType from './getMimeType';

const validateMimeType = (file, allowedFileTypes = []) => allowedFileTypes.length === 0 || allowedFileTypes.indexOf(getMimeType(file)) > -1;

export default validateMimeType;
