const getMimeType = (file: File | Express.Multer.File): string => 'type' in file ? file.type : file.mimetype;

export default getMimeType;
