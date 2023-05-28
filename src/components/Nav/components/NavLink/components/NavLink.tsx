import React, { memo } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import classNames from 'classnames';
import { PropsType } from '../types';
import '../styles/nav-link.scss';

const NavLink = ({ className, routePath, title }: PropsType) => (
    <li className={ classNames('nav-link', className) }>
        <RouterNavLink to={ routePath }>{title}</RouterNavLink>
    </li>
);

export default memo<PropsType>(NavLink);
