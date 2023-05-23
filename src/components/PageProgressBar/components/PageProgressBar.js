import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import LinearProgress from '@mui/material/LinearProgress';
import '../styles/page-progressbar.scss';

/**
 * This component can be placed anywhere in the code,
 * and it will always appear at the top of the page.
 *
 * @param className
 * @param delayMs
 * @returns {JSX.Element|null}
 */
const PageProgressBar = ({ className, delayMs }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        let timer = setTimeout(() => {
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

PageProgressBar.propTypes = {
    className: PropTypes.string,
    delayMs: PropTypes.number,
};

PageProgressBar.defaultProps = {
    className: '',
    delayMs: 0,
};

export default memo(PageProgressBar);
