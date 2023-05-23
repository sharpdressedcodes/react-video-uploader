import React, { forwardRef, memo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert/* , { AlertProps } */ from '@mui/material/Alert';

const Alert = forwardRef/* <HTMLDivElement, AlertProps> */((
    props,
    ref,
) => <MuiAlert elevation={ 6 } ref={ ref } variant="filled" { ...props } />);

const Toast = ({ autoHideDuration, className, children, onClosed, severity }) => {
    const [open, setOpen] = useState(true);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        onClosed(reason);
    };
    const action = (
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={ handleClose }
        >
            <CloseIcon fontSize="small" />
        </IconButton>
    );
    const snackbar = () => {
        const snackBarProps = {
            open,
            autoHideDuration,
            onClose: handleClose,
            action,
        };

        if (!severity) {
            return <Snackbar { ...snackBarProps } message={ children } />;
        }

        return (
            <Snackbar { ...snackBarProps }>
                <Alert onClose={ handleClose } severity={ severity } sx={ { width: '100%' } }>
                    { children }
                </Alert>
            </Snackbar>
        );
    };

    return <div className={ classNames('toast', className) }>{snackbar()}</div>;
};

Toast.displayName = 'Toast';

Toast.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    autoHideDuration: PropTypes.number,
    onClosed: PropTypes.func,
    severity: PropTypes.string,
};

Toast.defaultProps = {
    autoHideDuration: 6000,
    className: null,
    onClosed: Function.prototype,
    severity: null,
};

export default memo(Toast);
