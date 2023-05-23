import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const TeaserList = ({ className, children }) => (
    <ul className={ classNames('teaserlist', className) }>
        {children}
    </ul>
);

TeaserList.displayName = 'TeaserList';

TeaserList.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

TeaserList.defaultProps = {
    className: '',
};

export default memo(TeaserList);
