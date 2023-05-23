import React, { memo } from 'react';
import PropTypes from 'prop-types';
import FavIcons from './FavIcons';

const Head = ({
    charset,
    description,
    extraContent,
    favIcons,
    initialData,
    manifestFile,
    preloadedState,
    scripts,
    styles,
    title,
    viewport,
}) => (
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

Head.propTypes = {
    initialData: PropTypes.string.isRequired,
    preloadedState: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    charset: PropTypes.string,
    description: PropTypes.string,
    extraContent: PropTypes.node,
    favIcons: FavIcons.type.propTypes.icons,
    manifestFile: PropTypes.string,
    scripts: PropTypes.node,
    styles: PropTypes.node,
    viewport: PropTypes.string,
};

Head.defaultProps = {
    charset: 'UTF-8',
    description: null,
    extraContent: null,
    favIcons: FavIcons.type.defaultProps.icons,
    manifestFile: null,
    scripts: null,
    styles: null,
    viewport: 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no',
};

export default memo(Head);
