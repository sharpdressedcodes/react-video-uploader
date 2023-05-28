import React, { memo } from 'react';
import classNames from 'classnames';
import { PropsType } from '../types';
import NavLink, { NavLinkType } from './NavLink';
import { RouteType } from '../../../routes';
import '../styles/nav.scss';

const routesToNavLinks = (routes: RouteType[]) => routes
    .filter((route: RouteType) => Boolean(route.navLinkText))
    .reduce((acc: NavLinkType, curr: RouteType): NavLinkType => ({
        ...acc,
        [curr.navLinkText as any]: curr.path,
    }), {})
;

const Nav = ({ className, routes }: PropsType) => {
    const renderLinks = () => Object
        .entries(routesToNavLinks(routes))
        .map(([key, value]) => <NavLink key={ key } routePath={ value } title={ key } />)
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

export default memo<PropsType>(Nav);
