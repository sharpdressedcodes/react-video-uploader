import axios from 'axios';
//import xhrAdapter from 'axios/lib/adapters/xhr';
import config from '../config/main';

export function fetchVideos(id = null) {
    return axios.get(`http://localhost:3001${config.app.endpoints.api.video.get}${id ? `/${id}` : ''}`);//, { adapter: xhrAdapter });
}
