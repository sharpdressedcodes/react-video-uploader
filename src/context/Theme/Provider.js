import React, { memo, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { purple, deepPurple } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import ThemeContext from './Context';
import GlobalStyles from '../../components/GlobalStyles';

/**
 * Wrapper for MUI ThemeProvider that watches for dark mode changes.
 *
 * Note: Don't bother using useMediaQuery from mui as it
 * will cause server mismatch errors.
 *
 * @param children {React.ReactNode}
 * @returns {JSX.Element}
 * @constructor
 */
const Provider = ({ children }) => {
    const [prefersDarkMode, setPrefersDarkMode] = useState(true);
    const mqlRef = useRef(null);
    const [isPending, startTransition] = useTransition();
    const theme = useMemo(
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
    const runTransition = ({ matches }) => {
        startTransition(() => {
            setPrefersDarkMode(matches);
        });
    };
    const onChange = event => runTransition(event);

    useEffect(() => {
        if (!mqlRef.current) {
            mqlRef.current = window.matchMedia('(prefers-color-scheme: dark)');

            mqlRef.current.addEventListener('change', onChange);

            if (mqlRef.current.matches !== prefersDarkMode) {
                runTransition(mqlRef.current);
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

Provider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default memo(Provider);
