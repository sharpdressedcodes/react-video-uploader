import ActionTypes from '../constants/video';

// export function videoPlaybackError(context, payload) {
//     context.dispatch(ActionTypes.VIDEO_PLAYBACK_ERROR, payload);
// }

export function videoPlaybackError(payload) {
    return { type: ActionTypes.VIDEO_PLAYBACK_ERROR, payload };
}
