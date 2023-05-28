import React, { memo } from 'react';
import Head, { defaultProps as defaultHeadProps } from './Head';
import { DefaultPropsType, PropsType } from '../types';

const defaultProps: DefaultPropsType = {
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

const Html = ({
    appId = defaultProps.appId,
    bodyScripts = defaultProps.bodyScripts,
    bodyStyle = defaultProps.bodyStyle,
    charset = defaultProps.charset,
    children,
    description = defaultProps.description,
    dir = defaultProps.dir,
    extraHeadContent = defaultProps.extraHeadContent,
    favIcons = defaultProps.favIcons,
    initialData,
    lang = defaultProps.lang,
    manifestFile = defaultProps.manifestFile,
    preloadedState,
    scripts = defaultProps.scripts,
    styles = defaultProps.styles,
    title,
    version,
    viewport = defaultProps.viewport,
}: PropsType) => (
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

export default memo<PropsType>(Html);
