import React, { memo } from 'react';
import classNames from 'classnames';
import Modal from '../../Modal';
import Spinner from '../../Spinner';
import { PropsType } from '../types';
import '../styles/global-spinner.scss';

const GlobalSpinner = ({ className }: PropsType) => (
    <div className={ classNames('global-spinner', className) }>
        <Modal />
        <div className="global-spinner__background">
            <Spinner />
        </div>
    </div>
);

GlobalSpinner.displayName = 'GlobalSpinner';

export default memo<PropsType>(GlobalSpinner);
