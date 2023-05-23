import { v4 as uuid } from 'uuid';
import { getFileName } from './index';

export const createFileName = file => `${+new Date()}-${uuid()}-${getFileName(file)}`;

export const parseFileName = fileName => {
    const rx = /^(\d{13})-(([a-z0-9]{8})-([a-z0-9]{4})-([a-z0-9]{4})-([a-z0-9]{4})-([a-z0-9]{12}))/i;
    const [, ts, id] = fileName.match(rx);

    return { timestamp: ts, uuid: id };
};

export const findItemByUuid = (id, items) => items.find(str => {
    const parsedFileName = typeof str === 'string' ? parseFileName(str) : str;

    return id === parsedFileName.uuid;
});
