import { LinearProgressProps } from '@mui/material/LinearProgress';

export type DefaultPropsType = {
    hideLabelWhenEmpty: boolean;
};

export type PropsType = LinearProgressProps & Partial<DefaultPropsType> & {
    value: number
};
