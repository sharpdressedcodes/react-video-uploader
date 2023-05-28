import React, { memo, ReactNode, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';
// import { purple, deepPurple } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import ThemeContext from './Context';
import GlobalStyles from '../../components/GlobalStyles';

type ThemeProviderPropsType = {
    children: ReactNode;
}

/**
 * Wrapper for MUI ThemeProvider that watches for dark mode changes.
 *
 * Note: Don't bother using useMediaQuery from mui as it
 * will cause server mismatch errors.
 */
const Provider = ({ children }: ThemeProviderPropsType) => {
    const [prefersDarkMode, setPrefersDarkMode] = useState<boolean>(true);
    const mqlRef = useRef<Nullable<MediaQueryList>>(null);
    const [isPending, startTransition] = useTransition();
    const theme = useMemo<Theme>(
        () => createTheme({
            palette: {
                mode: prefersDarkMode ? 'dark' : 'light',
                ...(!prefersDarkMode ? {} : {
                    background: {
                        'default': '#202124',
                    },
                    text: {
                        primary: '#cdcdcd',
                    },
                }),
                // secondary: {
                //     // main: prefersDarkMode ? purple[500] : deepPurple[500],
                // },
            },
        }),
        [prefersDarkMode],
    );
    const value = useMemo(
        () => ({ theme, prefersDarkMode }),
        [theme, prefersDarkMode],
    );
    const runTransition = (matches: boolean) => {
        startTransition(() => {
            setPrefersDarkMode(matches);
        });
    };
    const onChange = ({ matches }: MediaQueryListEvent) => runTransition(matches);

    useEffect(() => {
        if (!mqlRef.current) {
            mqlRef.current = window.matchMedia('(prefers-color-scheme: dark)');

            mqlRef.current.addEventListener('change', onChange);

            if (mqlRef.current.matches !== prefersDarkMode) {
                runTransition(mqlRef.current.matches);
            }
        }

        return () => {
            if (mqlRef.current) {
                mqlRef.current.removeEventListener('change', onChange);
            }
        };
    }, [prefersDarkMode]);

    return (
        <ThemeContext.Provider value={ value }>
            <ThemeProvider theme={ theme }>
                <CssBaseline enableColorScheme />
                <GlobalStyles />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

Provider.displayName = 'ThemeProvider';

export default memo<ThemeProviderPropsType>(Provider);
