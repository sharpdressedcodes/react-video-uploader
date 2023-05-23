import ActionTypes from '../constants/video';

const { VIDEO_PLAYBACK_ERROR } = ActionTypes;

export function videoPlaybackError(payload) {
    return { type: VIDEO_PLAYBACK_ERROR, payload };
}
