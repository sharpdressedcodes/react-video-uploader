import fs, { PathLike } from 'node:fs';
import { promisify } from 'node:util';

const mkdir = promisify(fs.mkdir);

export const stat = promisify(fs.stat);
export const fileExists = async (file: PathLike) => {
    try {
        const stats = await stat(file);

        return stats.isFile();
    } catch (err) {
        return false;
    }
};
export const directoryExists = async (directory: PathLike) => {
    try {
        const stats = await stat(directory);

        return stats.isDirectory();
    } catch (err) {
        return false;
    }
};
export const createDirectory = async (directory: PathLike) => mkdir(directory, { recursive: true });
export const unlink = async (file: PathLike) => {
    try {
        await promisify(fs.unlink)(file);
        return true;
    } catch (err) {
        return false;
    }
};
export const close = promisify(fs.close);
export const open = promisify(fs.open);
export const readDirectory = promisify(fs.readdir);
export const read = promisify(fs.read);
export const readFile = promisify(fs.readFile);
export const rename = promisify(fs.rename);
export const write = promisify(fs.write);
export const writeFile = promisify(fs.writeFile);
