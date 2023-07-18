import React, { memo, useLayoutEffect, useRef, useState, useTransition } from 'react';
import { Router, BrowserRouterProps } from 'react-router-dom';
import { createBrowserHistory } from '@remix-run/router';
import PageProgressBar from '../../PageProgressBar';

/**
 * Until we have built-in support for using `React.lazy` with BrowserRouter,
 * we have to add our own, to prevent flickering when switching routes.
 *
 * Once we have built-in support, it should be safe to delete this component,
 * remove the dependency (@remix-run/router),
 * and revert back to using BrowserRouter from react-router-dom.
 *
 * See https://github.com/remix-run/react-router/discussions/9850 for more
 *
 */
const BrowserRouter = ({ window, ...rest }: BrowserRouterProps) => {
    const historyRef = useRef<ReturnType<typeof createBrowserHistory>>();

    if (historyRef.current == null) {
        historyRef.current = createBrowserHistory({ window, v5Compat: true });
    }

    const history = historyRef.current;
    const [state, setState] = useState({
        action: history.action,
        location: history.location,
    });
    const [isPending, startTransition] = useTransition();

    useLayoutEffect(() => history.listen(update => {
        startTransition(() => {
            setState(update);
        });
    }), [history]);

    return (
        <>
            {isPending && <PageProgressBar delayMs={ 250 } />}
            <Router
                { ...rest }
                location={ state.location }
                navigationType={ state.action }
                navigator={ history }
            />
        </>
    );
};

BrowserRouter.displayName = 'BrowserRouter';

export default memo<BrowserRouterProps>(BrowserRouter);
