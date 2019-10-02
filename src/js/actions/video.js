import ActionTypes from '../constants/video';

export function videoPlaybackError(payload) {
    return { type: ActionTypes.VIDEO_PLAYBACK_ERROR, payload };
}
