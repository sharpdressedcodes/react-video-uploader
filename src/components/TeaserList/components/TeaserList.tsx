import React, { memo } from 'react';
import { classNames } from '../../../common';
import { PropsType } from '../types';

const TeaserList = ({ className, children }: PropsType) => (
    <ul className={ classNames('teaserlist', className) }>
        {children}
    </ul>
);

TeaserList.displayName = 'TeaserList';

export default memo<PropsType>(TeaserList);
