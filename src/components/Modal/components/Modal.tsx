import React, { memo, useState } from 'react';
import classNames from 'classnames';
import { DefaultPropsType, PropsType } from '../types';
import '../styles/modal.scss';

export const defaultProps: DefaultPropsType = {
    children: null,
    closeOnClick: false,
    onClosed: () => {},
};

const Modal = ({
    children = defaultProps.children,
    className,
    closeOnClick = defaultProps.closeOnClick,
    onClosed = defaultProps.onClosed,
}: PropsType) => {
    const [closed, setClosed] = useState<boolean>(false);
    const onClick = () => {
        if (closeOnClick) {
            setClosed(true);
            if (onClosed) {
                onClosed();
            }
        }
    };

    if (closed) {
        return null;
    }

    return (
        <div
            className={ classNames('modal', className) }
            onClick={ onClick }
            tabIndex={ 0 }
            role="button"
        >
            {children}
        </div>
    );
};

Modal.displayName = 'Modal';

export default memo<PropsType>(Modal);
