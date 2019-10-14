import fs from 'fs';
import mkdirp from 'mkdirp';
import util from 'util';

export const readFile = util.promisify(fs.readFile);
export const readDir = util.promisify(fs.readdir);
export const writeFile = util.promisify(fs.writeFile);
export const fsUnlink = util.promisify(fs.unlink);
export const stat = util.promisify(fs.stat);
export const close = util.promisify(fs.close);
export const open = util.promisify(fs.open);
export const read = util.promisify(fs.read);
export const write = util.promisify(fs.write);
export const rename = util.promisify(fs.rename);

export function fileExists(file) {
    return new Promise((resolve, reject) => {
        try {
            fs.stat(file, (err, stats) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

export function directoryExists(directory) {
    return new Promise((resolve, reject) => {
        try {
            fs.stat(directory, (err, stats) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(stats.isDirectory());
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

export function createDirectory(directory) {
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

export function unlink(file) {
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
