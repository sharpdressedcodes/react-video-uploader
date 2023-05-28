const validateFileSize = (file: File | Express.Multer.File, maxFileSize = 0): boolean => maxFileSize === 0 || file.size <= maxFileSize;

export default validateFileSize;
