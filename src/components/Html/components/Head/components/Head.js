import React, { memo } from 'react';
import PropTypes from 'prop-types';

const Head = ({ charset, description, initialData, preloadedState, scripts, styles, title, viewport }) => (
    <head>
        <title>{title}</title>
        <meta charSet={ charset } />
        <meta name="description" content={ description || title } />
        <meta name="viewport" content={ viewport } />
        <script dangerouslySetInnerHTML={ { __html: `window.reactInitialData = ${initialData};` } } />
        <script dangerouslySetInnerHTML={ { __html: `window.reactPreloadedState = ${preloadedState};` } } />
        {styles}
        {scripts}
    </head>
);

Head.displayName = 'Head';

Head.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    initialData: PropTypes.any.isRequired,
    preloadedState: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    charset: PropTypes.string,
    description: PropTypes.string,
    scripts: PropTypes.node,
    styles: PropTypes.node,
    viewport: PropTypes.string,
};

Head.defaultProps = {
    charset: 'UTF-8',
    description: null,
    scripts: null,
    styles: null,
    viewport: 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no',
};

export default memo(Head);
