import React, { forwardRef, memo, MouseEvent, SyntheticEvent, useState } from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { classNames } from '../../../common';
import { DefaultPropsType, PropsType } from '../types';

const Alert = forwardRef<HTMLDivElement, AlertProps>((
    props,
    ref,
) => <MuiAlert elevation={ 6 } ref={ ref } variant="filled" { ...props } />);

export const defaultProps: DefaultPropsType = {
    autoHideDuration: 6000,
    className: null,
    onClosed: () => {},
    severity: null,
};

const Toast = ({
    autoHideDuration = defaultProps.autoHideDuration,
    className = defaultProps.className,
    children,
    onClosed = defaultProps.onClosed,
    severity = defaultProps.severity,
}: PropsType) => {
    const [open, setOpen] = useState<boolean>(true);
    const handleAlertClose = (event: SyntheticEvent) => {
        setOpen(false);

        if (onClosed) {
            onClosed();
        }
    };
    const handleButtonClose = (event: MouseEvent<HTMLButtonElement>) => {
        setOpen(false);

        if (onClosed) {
            onClosed();
        }
    };
    const handleSnackbarClose = (event: React.SyntheticEvent<any> | Event, reason: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);

        if (onClosed) {
            onClosed();
        }
    };
    const action = (
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={ handleButtonClose }
        >
            <CloseIcon fontSize="small" />
        </IconButton>
    );
    const renderSnackbar = () => {
        const snackBarProps = {
            open,
            autoHideDuration,
            onClose: handleSnackbarClose,
            action,
        };

        if (!severity) {
            return <Snackbar { ...snackBarProps } message={ children } />;
        }

        return (
            <Snackbar { ...snackBarProps }>
                <Alert onClose={ handleAlertClose } severity={ severity } sx={ { width: '100%' } }>
                    { children }
                </Alert>
            </Snackbar>
        );
    };

    return <div className={ classNames('toast', className) }>{renderSnackbar()}</div>;
};

Toast.displayName = 'Toast';

export default memo<PropsType>(Toast);
