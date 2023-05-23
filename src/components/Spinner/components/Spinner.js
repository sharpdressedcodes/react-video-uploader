import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import '../styles/spinner.scss';

// Spinner from https://github.com/n3r4zzurr0/svg-spinners
const Spinner = ({ className }) => (
    <svg
        className={ classNames('spinner', className) }
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect className="spinner-animation" x="1" y="1" rx="1" width="10" height="10" />
        <rect className="spinner-animation spinner-animation-2" x="1" y="1" rx="1" width="10" height="10" />
        <rect className="spinner-animation spinner-animation-3" x="1" y="1" rx="1" width="10" height="10" />
    </svg>
);

Spinner.displayName = 'Spinner';

Spinner.propTypes = {
    className: PropTypes.string,
};

Spinner.defaultProps = {
    className: null,
};

export default memo(Spinner);
