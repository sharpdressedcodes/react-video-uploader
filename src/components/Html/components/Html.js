import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Head from './Head';

const defaultHeadProps = Head.defaultProps ?? Head.type.defaultProps;
// eslint-disable-next-line react/forbid-foreign-prop-types
const headPropTypes = Head.propTypes ?? Head.type.propTypes;

// noinspection HtmlRequiredTitleElement
const Html = ({
    appId,
    bodyScripts,
    bodyStyle,
    charset,
    children,
    description,
    dir,
    extraHeadContent,
    favIcons,
    initialData,
    lang,
    manifestFile,
    preloadedState,
    scripts,
    styles,
    title,
    version,
    viewport,
}) => (
    <html dir={ dir } lang={ lang } data-version={ version }>
        <Head
            charset={ charset }
            description={ description }
            extraContent={ extraHeadContent }
            favIcons={ favIcons }
            initialData={ initialData }
            preloadedState={ preloadedState }
            manifestFile={ manifestFile }
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
    // isRequired is inherited from headPropTypes but eslint doesn't pick it up.
    /* eslint-disable react/require-default-props */
    initialData: headPropTypes.initialData,
    preloadedState: headPropTypes.preloadedState,
    /* eslint-enable react/require-default-props */
    title: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    appId: PropTypes.string,
    bodyScripts: PropTypes.node,
    bodyStyle: PropTypes.object,
    charset: headPropTypes.charset,
    description: headPropTypes.description,
    dir: PropTypes.string,
    extraHeadContent: headPropTypes.extraContent,
    favIcons: headPropTypes.favIcons,
    lang: PropTypes.string,
    manifestFile: headPropTypes.manifestFile,
    scripts: headPropTypes.scripts,
    styles: headPropTypes.styles,
    viewport: PropTypes.string,
};

Html.defaultProps = {
    appId: 'app',
    bodyScripts: null,
    bodyStyle: {},
    charset: defaultHeadProps.charset,
    description: defaultHeadProps.description,
    dir: 'ltr',
    extraHeadContent: defaultHeadProps.extraContent,
    favIcons: defaultHeadProps.favIcons,
    lang: 'en',
    manifestFile: defaultHeadProps.manifestFile,
    scripts: defaultHeadProps.scripts,
    styles: defaultHeadProps.styles,
    viewport: defaultHeadProps.viewport,
};

export default memo(Html);
