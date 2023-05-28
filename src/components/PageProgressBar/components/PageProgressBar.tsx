import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames';
import LinearProgress from '@mui/material/LinearProgress';
import { DefaultPropsType, PropsType } from '../types';
import '../styles/page-progressbar.scss';

export const defaultProps: DefaultPropsType = {
    delayMs: 0,
};

/**
 * This component can be placed anywhere in the code,
 * and it will always appear at the top of the page.
 */
const PageProgressBar = ({ className, delayMs = defaultProps.delayMs }: PropsType) => {
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = setTimeout(() => {
            timer = null;
            setShow(true);
        }, delayMs);

        return () => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
        };
    }, [delayMs, setShow]);

    return show ? <LinearProgress className={ classNames('page-progressbar', className) } /> : null;
};

PageProgressBar.displayName = 'PageProgressBar';

export default memo<PropsType>(PageProgressBar);
