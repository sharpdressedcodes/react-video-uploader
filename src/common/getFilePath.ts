import { Express } from 'express';

const getFilePath = (file: File | Express.Multer.File): string => ('path' in file ? file.path : file.webkitRelativePath);

export default getFilePath;
