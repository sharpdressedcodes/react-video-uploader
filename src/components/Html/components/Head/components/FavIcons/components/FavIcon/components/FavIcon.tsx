import React, { HTMLAttributes, HTMLProps, memo } from 'react';
import { PropsType, DefaultPropsType } from '../types';

export const defaultProps: DefaultPropsType = {
    rel: 'icon',
    sizes: null,
};

const FavIcon = ({
    src,
    type,
    rel = defaultProps.rel,
    sizes = defaultProps.sizes,
}: PropsType) => {
    const props: HTMLProps<HTMLLinkElement> & HTMLAttributes<HTMLLinkElement> = {
        href: src.startsWith('/') ? src : `/${src}`,
        rel,
        type,
    };

    if (sizes && !props.href?.toLowerCase().includes('/favicon')) {
        props.sizes = sizes;
    }

    return <link { ...props } />;
};

FavIcon.displayName = 'FavIcon';

export default memo<PropsType>(FavIcon);
