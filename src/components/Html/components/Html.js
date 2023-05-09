import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Head from './Head';

const { defaultProps: defaultHeadProps } = Head.type;

// noinspection HtmlRequiredTitleElement
const Html = ({
    appId, bodyScripts, bodyStyle, charset, children, description, dir, initialData, lang, preloadedState, scripts, styles, title, version, viewport,
}) => (
    <html dir={ dir } lang={ lang } data-version={ version }>
        <Head
            charset={ charset }
            description={ description }
            initialData={ initialData }
            preloadedState={ preloadedState }
            scripts={ scripts }
            styles={ styles }
            title={ title }
            viewport={ viewport }
        />
        <body style={ bodyStyle }>
            <div id={ appId }>{children}</div>
            {bodyScripts}
        </body>
    </html>
);

Html.displayName = 'Html';

Html.propTypes = {
    children: PropTypes.node.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    initialData: PropTypes.any.isRequired,
    preloadedState: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    appId: PropTypes.string,
    bodyScripts: PropTypes.node,
    bodyStyle: PropTypes.object,
    charset: PropTypes.string,
    description: PropTypes.string,
    dir: PropTypes.string,
    lang: PropTypes.string,
    scripts: PropTypes.node,
    styles: PropTypes.node,
    viewport: PropTypes.string,
};

Html.defaultProps = {
    appId: 'app',
    bodyScripts: null,
    bodyStyle: { opacity: 0 },
    charset: defaultHeadProps.charset,
    description: defaultHeadProps.description,
    dir: 'ltr',
    lang: 'en',
    scripts: defaultHeadProps.scripts,
    styles: defaultHeadProps.styles,
    viewport: defaultHeadProps.viewport,
};

export default memo(Html);
