import { HomePage, NoMatchPage, UploadPage, VideoPlayerPage } from '../components/pages';
import paths from './paths';

const routes = [
    { name: 'homePage', exact: true, element: HomePage, navLinkText: 'Home' },
    { name: 'uploadPage', element: UploadPage, navLinkText: 'Upload' },
    { name: 'videoPlayerPage', element: VideoPlayerPage },
    { name: 'noMatchPage', element: NoMatchPage }
].map(route => ({ ...route, path: paths[route.name] }));

export const navLinks = routes
    .filter(route => Boolean(route.navLinkText))
    .reduce((acc, curr) => ({
        ...acc,
        [curr.navLinkText]: curr.path
    }), {})
;

export default routes;
