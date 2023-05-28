const validateTotalFileSize = (files: Array<File | Express.Multer.File>, maxTotalFileSize = 0): boolean => {
    if (!maxTotalFileSize) {
        return true;
    }

    const totalSize = files.reduce((acc: number, curr: File | Express.Multer.File) => acc + curr.size, 0);

    return totalSize <= maxTotalFileSize;
};

export default validateTotalFileSize;
