import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import '../styles/nav.scss';

const Nav = ({ className, links }) => {
    const renderLinks = () => Object
        .entries(links)
        .map(([key, value]) => (
            <li key={ key }>
                <NavLink to={ value }>{key}</NavLink>
            </li>
        ))
    ;

    return (
        <nav className={ classNames('navbar', className) }>
            <ul>
                {renderLinks()}
            </ul>
        </nav>
    );
};

Nav.displayName = 'Nav';

Nav.propTypes = {
    links: PropTypes.object.isRequired,
    className: PropTypes.string,
};

Nav.defaultProps = {
    className: '',
};

export default memo(Nav);
