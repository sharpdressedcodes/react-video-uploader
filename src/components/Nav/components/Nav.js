import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import { NavLink } from 'react-router-dom';
import '../styles/nav.scss';

class Nav extends Component {
    static displayName = 'Nav';

    static propTypes = {
        links: PropTypes.object.isRequired
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState) || !isEqual(this.context, nextContext);
    }

    renderLinks() {
        const { links } = this.props;

        return Object
            .entries(links)
            .map(([key, value]) => (
                <li key={ key }>
                    <NavLink to={ value }>{key}</NavLink>
                </li>
            ))
        ;
        // return Object.keys(links).map((item, index) => {
        //     const key = `link-${index}`;
        //
        //     return (
        //         <li key={ key }>
        //             <NavLink to={links[item]}>{item}</NavLink>
        //         </li>
        //     );
        // });
    }

    render() {
        return (
            <nav className="navbar">
                <ul>
                    {this.renderLinks()}
                </ul>
            </nav>
        );
    }
}

export default Nav;
