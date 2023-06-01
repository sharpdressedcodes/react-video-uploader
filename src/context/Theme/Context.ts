import { createContext } from 'react';
import { Theme } from '@mui/material/styles';

export type ThemeContextType = {
    theme: Nullable<Theme>;
    prefersDarkMode: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
    theme: null,
    prefersDarkMode: false,
});

ThemeContext.displayName = 'ThemeContext';

export default ThemeContext;
