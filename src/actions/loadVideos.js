import ActionTypes from '../constants/loadVideos';

const { LOAD_VIDEOS_ERROR, LOAD_VIDEOS_SUCCESS } = ActionTypes;

export function loadVideosSuccess(payload) {
    return { type: LOAD_VIDEOS_SUCCESS, payload };
}

export function loadVideosError(payload) {
    return { type: LOAD_VIDEOS_ERROR, payload };
}
