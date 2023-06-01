import React, { memo } from 'react';
import FavIcon, { defaultProps as defaultFavIconProps, PropsType as FavIconPropsType } from './FavIcon';
import { DefaultPropsType, PropsType } from '../types';

export const defaultProps: DefaultPropsType = {
    icons: [],
};

const FavIcons = ({ icons = defaultProps.icons }: PropsType) => (
    <>
        {icons!.map(({
            src,
            type,
            rel = defaultFavIconProps.rel,
            sizes = defaultFavIconProps.sizes,
        }: FavIconPropsType) => <FavIcon key={ src } src={ src } type={ type } rel={ rel } sizes={ sizes } />)}
    </>
);

FavIcons.displayName = 'FavIcons';

export default memo<PropsType>(FavIcons);
