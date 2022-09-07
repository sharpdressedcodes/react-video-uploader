import { HomePage, NoMatchPage, UploadPage, VideoPage } from '../components/pages';
import paths from './paths';

const routes = [
    { name: 'homePage', exact: true, element: HomePage, navLinkText: 'Home' },
    { name: 'uploadPage', element: UploadPage, navLinkText: 'Upload' },
    { name: 'videoPage', element: VideoPage },
    { name: 'noMatchPage', element: NoMatchPage }
].map(route => ({ ...route, path: paths[route.name] }));

export const navLinks = routes
    .filter(route => !!route.navLinkText)
    .reduce((acc, curr) => ({
        ...acc,
        [curr.navLinkText]: curr.path
    }), {})
;

export default routes;
