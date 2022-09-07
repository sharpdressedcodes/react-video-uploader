const validateFileSize = (file, maxFileSize = 0) => maxFileSize === 0 || file.size <= maxFileSize;

export default validateFileSize;
