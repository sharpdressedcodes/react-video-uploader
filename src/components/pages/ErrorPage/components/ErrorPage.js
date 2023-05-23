import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const ErrorPage = ({ className, error }) => <div className={ classNames('page-error', className) }>{error}</div>;

ErrorPage.displayName = 'ErrorPage';

ErrorPage.propTypes = {
    error: PropTypes.node.isRequired,
    className: PropTypes.string,
};

ErrorPage.defaultProps = {
    className: null,
};

export default ErrorPage;
