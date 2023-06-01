import { Express } from 'express';

const validateMaxFiles = (files: Array<File | Express.Multer.File>, maxFiles = 0): boolean => maxFiles === 0 || files.length <= maxFiles;

export default validateMaxFiles;
