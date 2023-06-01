import { CSSProperties, ReactNode } from 'react';
import { DefaultPropsType as DefaultHeadPropsType, PropsType as HeadPropsType } from '../components/Head';

export type DefaultPropsType = {
    appId?: string;
    bodyScripts?: ReactNode;
    bodyStyle?: CSSProperties;
    charset?: DefaultHeadPropsType['charset'];
    description?: DefaultHeadPropsType['description'];
    dir?: string;
    extraHeadContent?: DefaultHeadPropsType['extraContent'];
    favIcons?: DefaultHeadPropsType['favIcons'];
    lang?: string;
    manifestFile?: DefaultHeadPropsType['manifestFile'];
    scripts?: DefaultHeadPropsType['scripts'];
    styles?: DefaultHeadPropsType['styles'];
    viewport?: DefaultHeadPropsType['viewport'];
};

export type PropsType = DefaultPropsType & {
    children: ReactNode;
    initialData: HeadPropsType['initialData'];
    preloadedState: HeadPropsType['preloadedState'];
    title: string;
    version: string;
};
