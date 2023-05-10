import { createTheme } from '@mui/material/styles';
import { deepPurple } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        secondary: {
            main: deepPurple[500],
        },
    },
});

export default theme;
