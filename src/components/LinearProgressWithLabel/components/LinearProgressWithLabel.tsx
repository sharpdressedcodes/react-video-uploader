import React, { memo } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { DefaultPropsType, PropsType } from '../types';

export const defaultProps: DefaultPropsType = {
    hideLabelWhenEmpty: false,
};

const LinearProgressWithLabel = ({ hideLabelWhenEmpty, ...rest }: PropsType) => {
    const value = Math.round(rest.value);

    if (hideLabelWhenEmpty && !value) {
        return <LinearProgress variant="determinate" { ...rest } />;
    }

    return (
        <Box sx={ { display: 'flex', alignItems: 'center' } }>
            <Box sx={ { width: '100%', mr: 1 } }>
                <LinearProgress variant="determinate" { ...rest } />
            </Box>
            <Box sx={ { minWidth: 35 } }>
                <Typography variant="body2" color="text.secondary">
                    {`${value}%`}
                </Typography>
            </Box>
        </Box>
    );
};

LinearProgressWithLabel.displayName = 'LinearProgressWithLabel';

export default memo<PropsType>(LinearProgressWithLabel);
