import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React, { memo, Suspense, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ErrorBoundary from '../../ErrorBoundary';
import GlobalSpinner from '../../GlobalSpinner';
import Nav from '../../Nav';
import { routes, navLinks } from '../../../routes';
import { loadVideosSuccess } from '../../../state/reducers/loadVideos';
import '../styles/app.scss';

const App = ({ data }) => {
    const dispatch = useDispatch();

    if (data) {
        dispatch(loadVideosSuccess(data));
    }

    useEffect(() => {
        if (document) {
            document.body.style.opacity = '1';
        }
    }, []);

    return (
        <ErrorBoundary fallback={ <div>Oops! Something went wrong!</div> }>
            <h1>Video Uploader</h1>
            <Nav links={ navLinks } />

            <section className="page">
                <Suspense fallback={ <GlobalSpinner /> }>
                    <Routes>
                        {routes.map(({
                            path,
                            exact,
                            element: Page,
                            ...rest
                        }) => (
                            <Route
                                key={ path }
                                path={ path }
                                exact={ exact }
                                element={ <Page { ...rest } /> }
                            />
                        ))}
                    </Routes>
                </Suspense>
            </section>
        </ErrorBoundary>
    );
};

App.displayName = 'App';

App.propTypes = {
    data: PropTypes.array.isRequired,
};

export default memo(App);
