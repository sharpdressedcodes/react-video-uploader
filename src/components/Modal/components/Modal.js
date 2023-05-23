import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import '../styles/modal.scss';

const Modal = ({ children, className, closeOnClick, onClosed }) => {
    const [closed, setClosed] = useState(false);
    const onClick = () => {
        if (closeOnClick) {
            setClosed(true);
            onClosed();
        }
    };

    if (closed) {
        return null;
    }

    return (
        <div
            className={ classNames('modal', className) }
            onClick={ onClick }
            tabIndex="0"
            role="button"
        >
            {children}
        </div>
    );
};

Modal.displayName = 'Modal';

Modal.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    closeOnClick: PropTypes.bool,
    onClosed: PropTypes.func,
};

Modal.defaultProps = {
    children: null,
    className: null,
    closeOnClick: false,
    onClosed: Function.prototype,
};

export default memo(Modal);
