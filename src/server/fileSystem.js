const fs = require('node:fs');
const { promisify } = require('node:util');
const mkdirp = require('mkdirp');

const stat = promisify(fs.stat);
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
const createDirectory = directory => new Promise((resolve, reject) => {
    try {
        mkdirp(directory, {}, () => {
            resolve(directory);
        });
    } catch (err) {
        reject(err);
    }
});
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
