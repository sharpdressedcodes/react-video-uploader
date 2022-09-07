const validateTotalFileSize = (files, maxTotalFileSize = 0) => {
    if (!maxTotalFileSize) {
        return true;
    }

    const totalSize = files.reduce((acc, curr) => acc + curr.size, 0);

    return totalSize <= maxTotalFileSize;
};

export default validateTotalFileSize;
