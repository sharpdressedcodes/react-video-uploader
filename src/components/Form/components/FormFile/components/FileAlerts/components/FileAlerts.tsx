import React, { memo, MouseEvent } from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import useSetState from '../../../../../../../hooks/useSetState';
import { DefaultFileAlertsPropsType, FileAlertsPropsType, StateType } from '../types';
import { ReactComponent as ErrorSvg } from '../../../../../../../assets/icons/error.svg';

export const defaultProps: DefaultFileAlertsPropsType = {
    text: 'Invalid',
};

export const DEFAULT_STATE: StateType = {
    popoverAnchor: null,
};

const FileAlerts = ({
    alerts,
    text = defaultProps.text,
}: FileAlertsPropsType) => {
    const [state, setState] = useSetState(FileAlerts.DEFAULT_STATE);

    const errorLabel = (count: number) => {
        if (count === 0) {
            return 'no errors';
        }

        if (count > 99) {
            return 'more than 99 errors';
        }

        return `${count} errors`;
    };
    const onFileListItemErrorClick = (event: MouseEvent<HTMLButtonElement>) => {
        setState({ popoverAnchor: event.currentTarget });
    };
    const onFileListItemErrorClose = () => {
        setState({ popoverAnchor: null });
    };
    const render = () => {
        if (!alerts) {
            return null;
        }

        const len = alerts.length;

        return (
            <>
                {text}
                <IconButton
                    aria-label={ errorLabel(len) }
                    className="file-status__badge"
                    onClick={ onFileListItemErrorClick }
                >
                    <Badge badgeContent={ len } color="error">
                        <ErrorSvg />
                    </Badge>
                </IconButton>
                <Popover
                    anchorEl={ state.popoverAnchor }
                    open={ Boolean(state.popoverAnchor) }
                    onClose={ onFileListItemErrorClose }
                >
                    <Typography
                        sx={ { p: 2 } }
                        dangerouslySetInnerHTML={ { __html: alerts.map(({ message }) => message).join('<br />') } }
                    />
                </Popover>
            </>
        );
    };

    return render();
};

FileAlerts.displayName = 'FileAlerts';

FileAlerts.DEFAULT_STATE = DEFAULT_STATE;

export default memo<FileAlertsPropsType>(FileAlerts);
