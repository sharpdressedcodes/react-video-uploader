import { lazy } from 'react';
import paths from './paths';

const HomePage = lazy(() => import(/* webpackChunkName: "home-page" */ '../components/pages/HomePage'));
const UploadPage = lazy(() => import(/* webpackChunkName: "upload-page" */ '../components/pages/UploadPage'));
const VideoPlayerPage = lazy(() => import(/* webpackChunkName: "video-player-page" */ '../components/pages/VideoPlayerPage'));
const NoMatchPage = lazy(() => import(/* webpackChunkName: "no-match-page" */ '../components/pages/NoMatchPage'));
const routes = [
    {
        name: 'homePage',
        exact: true,
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
].map(route => ({ ...route, path: paths[route.name] }));

export const navLinks = routes
    .filter(route => Boolean(route.navLinkText))
    .reduce((acc, curr) => ({
        ...acc,
        [curr.navLinkText]: curr.path,
    }), {})
;

export default routes;
