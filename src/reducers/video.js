import ActionTypes from '../constants/video';

const { VIDEO_PLAYBACK_ERROR } = ActionTypes;

export const initialState = {
    videoPlaybackError: null,
    video: null,
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case VIDEO_PLAYBACK_ERROR:
            return {
                ...state,
                videoPlaybackError: action.payload,
            };

        default:
            // Do nothing
    }

    return state;
}
