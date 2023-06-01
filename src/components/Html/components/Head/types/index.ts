import { ReactNode } from 'react';
import { PropsType as FavIconsPropsType } from '../components/FavIcons';

export type DefaultPropsType = {
    charset?: string;
    description?: Nullable<string>;
    extraContent?: ReactNode;
    favIcons?: FavIconsPropsType['icons'],
    manifestFile?: Nullable<string>,
    scripts?: ReactNode;
    styles?: ReactNode;
    viewport?: string;
};

export type PropsType = DefaultPropsType & {
    initialData: string;
    preloadedState: string;
    title: string;
};
