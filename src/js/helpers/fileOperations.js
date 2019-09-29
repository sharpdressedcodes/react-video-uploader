const fs = require('fs');
const mkdirp = require('mkdirp');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile);
const fsUnlink = util.promisify(fs.unlink);
const stat = util.promisify(fs.stat);
const close = util.promisify(fs.close);
const open = util.promisify(fs.open);
const read = util.promisify(fs.read);
const write = util.promisify(fs.write);

function unlink(file) {
    return new Promise((resolve, reject) => {
        fileExists(file)
            .then(result => {
                fsUnlink(file)
                    .then(resolve)
                    .catch(resolve);
            })
            .catch(resolve);
    });
}

function fileExists(file) {
    return new Promise((resolve, reject) => {
        try {
            fs.stat(file, (err, stats) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(stats);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

function directoryExists(directory) {
    return new Promise((resolve, reject) => {
        try {
            fs.stat(directory, (err, stats) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(stats.isDirectory() ? stats : false);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

function createDirectory(directory) {
    return new Promise((resolve, reject) => {
        try {
            mkdirp.mkdirP(directory, {}, () => {
                resolve(directory);
            });
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    open,
    close,
    writeFile,
    readFile,
    readDir,
    fileExists,
    directoryExists,
    createDirectory,
    unlink,
    stat,
    read,
    write
};
