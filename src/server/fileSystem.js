const fs = require('node:fs');
const { promisify } = require('node:util');

const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const fileExists = async file => {
    try {
        const stats = await stat(file);

        return stats.isFile();
    } catch (err) {
        return false;
    }
};
const directoryExists = async directory => {
    try {
        const stats = await stat(directory);

        return stats.isDirectory();
    } catch (err) {
        return false;
    }
};
const createDirectory = async directory => mkdir(directory, { recursive: true });
const unlink = async file => {
    try {
        await promisify(fs.unlink)(file);
        return true;
    } catch (err) {
        return false;
    }
};

module.exports = {
    close: promisify(fs.close),
    open: promisify(fs.open),
    readDirectory: promisify(fs.readdir),
    read: promisify(fs.read),
    readFile: promisify(fs.readFile),
    rename: promisify(fs.rename),
    stat,
    write: promisify(fs.write),
    writeFile: promisify(fs.writeFile),
    fileExists,
    directoryExists,
    createDirectory,
    unlink,
};
