import axios from 'axios';
// import xhrAdapter from 'axios/lib/adapters/xhr';
import config from '../config';

export function fetchVideos(id = null) {
    return axios.get(`${config.get('app.endpoints.api.video.get')}${id ? `/${id}` : ''}`);// , { adapter: xhrAdapter });
}
