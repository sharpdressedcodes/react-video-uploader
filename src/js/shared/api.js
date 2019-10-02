import axios from 'axios';
//import xhrAdapter from 'axios/lib/adapters/xhr';
import config from '../config/main';
import { loadVideosSuccess, loadVideosError } from '../actions/loadVideos';

export function fetchVideos(id = null) {
    console.log('fetchVideos called', id);
    return axios.get(`http://localhost:3001${config.app.endpoints.api.video.get}${id ? `/${id}` : ''}`);//, { adapter: xhrAdapter });
}

// export function fetchVideos(id = null) {
//     return dispatch => {
//         axios.get(`http://localhost:3001${config.app.endpoints.api.video.get}${id ? `/${id}` : ''}`)
//             .then(response => {
//                 dispatch(loadVideosSuccess(response.data));
//                 return response.data;
//             })
//             .catch(err => {
//                 dispatch(loadVideosError({ error: err.message}));
//             });
//     };
// }
