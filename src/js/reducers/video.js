import VideoActionTypes from '../constants/video';

export const initialState = {
    videoPlaybackError: null,
    video: null,
};

export default function reducer(state = initialState, action) {

    switch (action.type) {
        case VideoActionTypes.VIDEO_PLAYBACK_ERROR:
            return {
                ...state,
                videoPlaybackError: action.payload
            };

        default:
        // Do nothing
    }

    return state;
}
