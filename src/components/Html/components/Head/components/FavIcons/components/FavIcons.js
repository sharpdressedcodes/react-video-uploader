import React, { memo } from 'react';
import PropTypes from 'prop-types';

const FavIcons = ({ icons }) => icons.map(({ src, type, rel = 'icon', sizes = null }) => {
    const props = {
        href: src.startsWith('/') ? src : `/${src}`,
        key: src,
        rel,
        type,
    };

    if (sizes && !props.href.toLowerCase().includes('/favicon')) {
        props.sizes = sizes;
    }

    return <link { ...props } />;
});

FavIcons.displayName = 'FavIcons';

FavIcons.propTypes = {
    icons: PropTypes.arrayOf(PropTypes.shape({
        src: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        rel: PropTypes.string,
        sizes: PropTypes.string,
    })),
};

FavIcons.defaultProps = {
    icons: [],
};

export default memo(FavIcons);
