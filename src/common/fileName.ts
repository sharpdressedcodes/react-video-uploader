import { v4 as uuid } from 'uuid';
import { getFileName } from './index';
import { LoadedVideoType } from '../state/types';

export const createFileName = (file: File | Express.Multer.File): string => `${+new Date()}-${uuid()}-${getFileName(file)}`;

export type ParsedFileNameType = { timestamp: string, uuid: string } | null;

export const parseFileName = (fileName: string): ParsedFileNameType => {
    const rx = /^(\d{13})-(([a-z0-9]{8})-([a-z0-9]{4})-([a-z0-9]{4})-([a-z0-9]{4})-([a-z0-9]{12}))/i;
    const match = fileName.match(rx);

    if (!match) {
        return null;
    }

    const [, ts, id] = match;

    return { timestamp: ts, uuid: id };
};

export const findItemByUuid = <T extends LoadedVideoType | string>(id: string, items: T[]) =>
    items.find(str => {
        const parsedFileName = typeof str === 'string' ? parseFileName(str as string) : str;

        return id === (parsedFileName as ParsedFileNameType | LoadedVideoType)?.uuid;
    })
;
