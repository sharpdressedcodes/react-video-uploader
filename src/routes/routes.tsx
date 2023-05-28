import React, { lazy } from 'react';
import { RouteType } from './types';
import paths from './paths';

const HomePage = lazy(() => import(/* webpackChunkName: "home-page" */ '../components/pages/HomePage'));
const UploadPage = lazy(() => import(/* webpackChunkName: "upload-page" */ '../components/pages/UploadPage'));
const VideoPlayerPage = lazy(() => import(/* webpackChunkName: "video-player-page" */ '../components/pages/VideoPlayerPage'));
const NoMatchPage = lazy(() => import(/* webpackChunkName: "no-match-page" */ '../components/pages/NoMatchPage'));

const routes: RouteType[] = [
    {
        name: 'homePage',
        element: HomePage,
        navLinkText: 'Home',
    },
    {
        name: 'uploadPage',
        element: UploadPage,
        navLinkText: 'Upload',
    },
    {
        name: 'videoPlayerPage',
        element: VideoPlayerPage,
    },
    {
        name: 'noMatchPage',
        element: NoMatchPage,
    },
].map((route: RouteType) => ({ ...route, path: paths[route.name] }));

export default routes;
