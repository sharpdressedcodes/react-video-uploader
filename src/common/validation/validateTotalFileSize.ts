import { Express } from 'express';

type ExpressFile = Express.Multer.File;
type BrowserOrServerFile = File | ExpressFile;

const validateTotalFileSize = (files: BrowserOrServerFile[], maxTotalFileSize = 0): boolean => {
    if (!maxTotalFileSize) {
        return true;
    }

    const totalSize = files.reduce((acc: number, curr: BrowserOrServerFile) => acc + curr.size, 0);

    return totalSize <= maxTotalFileSize;
};

export default validateTotalFileSize;
