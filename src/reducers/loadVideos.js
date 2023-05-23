import ActionTypes from '../constants/loadVideos';

const { LOAD_VIDEOS_ERROR, LOAD_VIDEOS_SUCCESS } = ActionTypes;

export const initialState = {
    videos: null,
    videosDownloadError: null,
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case LOAD_VIDEOS_SUCCESS:
            return {
                ...state,
                videosDownloadError: null,
                videos: action.payload,
            };

        case LOAD_VIDEOS_ERROR:
            return {
                ...state,
                videosDownloadError: action.payload,
            };

        default:
            // Do nothing
    }

    return state;
}
