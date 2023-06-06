import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React, { memo, Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import GlobalSpinner from '../../GlobalSpinner';
import Nav from '../../Nav';
import { routes } from '../../../routes';
import { loadVideosSuccess } from '../../../state/reducers/loadVideos';
import { useAppDispatch } from '../../../state/hooks';
import { PropsType } from '../types';
import '../styles/app.scss';

const App = ({ data }: PropsType) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (document) {
            document.body.style.opacity = '1';
        }

        if (data) {
            dispatch(loadVideosSuccess(data));
        }
    }, []);

    return (
        <>
            <h1>Video Uploader</h1>
            <Nav routes={ routes } />

            <section className="page">
                <Suspense fallback={ <GlobalSpinner /> }>
                    <Routes>
                        {routes.map(({
                            path,
                            element: Page,
                            ...rest
                        }) => (
                            <Route
                                key={ path }
                                path={ path }
                                element={ <Page { ...rest } /> }
                            />
                        ))}
                    </Routes>
                </Suspense>
            </section>
        </>
    );
};

App.displayName = 'App';

export default memo<PropsType>(App);
