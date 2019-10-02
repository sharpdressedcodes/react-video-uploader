import HomePage from '../components/pages/homePage';
import UploadPage from '../components/pages/uploadPage';
import VideoPage from '../components/pages/videoPage';
import { fetchVideos } from './api';

const routes = [
    {
        path: '/',
        exact: true,
        component: HomePage,
        //fetchInitialData: (path = '') => fetchVideos()
        fetchInitialData: (path = '') => fetchVideos()
    },
    {
        path: '/upload',
        component: UploadPage,
        fetchInitialData: (path) => fetchVideos()
    },
    {
        //path: '/video/:id(\d+)',
        path: '/video/:id',
        component: VideoPage,
        //fetchInitialData: (path = '') => fetchVideos(path.split('/').pop())
        //fetchInitialData: (req) => fetchVideos(req.params)//.params.id)
        //fetchInitialData: (path) => fetchVideos(path.split('/').pop())
        fetchInitialData: (path) => fetchVideos()
    }
];

export default routes;
