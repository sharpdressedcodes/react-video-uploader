import ActionTypes from '../constants/loadVideos';

export function loadVideosSuccess(payload) {
    return { type: ActionTypes.LOAD_VIDEOS_SUCCESS, payload };
}

export function loadVideosError(payload) {
    return { type: ActionTypes.LOAD_VIDEOS_ERROR, payload };
}
