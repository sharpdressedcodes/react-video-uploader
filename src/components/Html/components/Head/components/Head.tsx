import React, { memo } from 'react';
import FavIcons, { defaultProps as favIconsDefaultProps } from './FavIcons';
import { DefaultPropsType, PropsType } from '../types';

export const defaultProps: DefaultPropsType = {
    charset: 'UTF-8',
    description: null,
    extraContent: null,
    favIcons: favIconsDefaultProps.icons,
    manifestFile: null,
    scripts: null,
    styles: null,
    viewport: 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no',
};

const Head = ({
    charset = defaultProps.charset,
    description = defaultProps.description,
    extraContent = defaultProps.extraContent,
    favIcons = defaultProps.favIcons,
    initialData,
    manifestFile = defaultProps.manifestFile,
    preloadedState,
    scripts = defaultProps.scripts,
    styles = defaultProps.styles,
    title,
    viewport = defaultProps.viewport,
}: PropsType) => (
    <head>
        <style dangerouslySetInnerHTML={ { __html: `body {opacity: 0;}` } } />
        <title>{title}</title>
        <meta charSet={ charset } />
        <meta name="description" content={ description || title } />
        <meta name="viewport" content={ viewport } />
        <FavIcons icons={ favIcons } />
        {manifestFile && <link rel="manifest" href={ manifestFile } />}
        <script dangerouslySetInnerHTML={ { __html: `window.reactInitialData = ${initialData};` } } />
        <script dangerouslySetInnerHTML={ { __html: `window.reactPreloadedState = ${preloadedState};` } } />
        {styles}
        {scripts}
        {extraContent}
    </head>
);

Head.displayName = 'Head';

export default memo<PropsType>(Head);
