import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Modal from '../../Modal';
import Spinner from '../../Spinner';
import '../styles/global-spinner.scss';

const GlobalSpinner = ({ className }) => (
    <div className={ classNames('global-spinner', className) }>
        <Modal />
        <div className="global-spinner__background">
            <Spinner />
        </div>
    </div>
);

GlobalSpinner.displayName = 'GlobalSpinner';

GlobalSpinner.propTypes = {
    className: PropTypes.string,
};

GlobalSpinner.defaultProps = {
    className: null,
};

export default memo(GlobalSpinner);
