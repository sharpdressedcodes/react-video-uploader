const validateMaxFiles = (files, maxFiles = 0) => maxFiles === 0 || files.length <= maxFiles;

export default validateMaxFiles;
