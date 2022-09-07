import fs from 'node:fs';
import { promisify } from 'node:util';
import mkdirp from 'mkdirp';

export const close = promisify(fs.close);
export const open = promisify(fs.open);
export const readDirectory = promisify(fs.readdir);
export const read = promisify(fs.read);
export const readFile = promisify(fs.readFile);
export const rename = promisify(fs.rename);
export const stat = promisify(fs.stat);
export const write = promisify(fs.write);
export const writeFile = promisify(fs.writeFile);

export async function fileExists(file) {
    try {
        const stats = await stat(file);

        return stats.isFile();
    } catch (err) {
        return false;
    }
}

export async function directoryExists(directory) {
    try {
        const stats = await stat(directory);

        return stats.isDirectory();
    } catch (err) {
        return false;
    }
}

export function createDirectory(directory) {
    return new Promise((resolve, reject) => {
        try {
            mkdirp(directory, {}, () => {
                resolve(directory);
            });
        } catch (err) {
            reject(err);
        }
    });
}

export async function unlink(file) {
    try {
        await promisify(fs.unlink)(file);
        return true;
    } catch (err) {
        return false;
    }
}
