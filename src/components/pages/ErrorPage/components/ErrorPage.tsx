import React from 'react';
import { classNames } from '../../../../common';
import { PropsType } from '../types';

const ErrorPage = ({
    className,
    error,
}: PropsType) => <div className={ classNames('page-error', className) }>{error}</div>;

ErrorPage.displayName = 'ErrorPage';

export default ErrorPage;
