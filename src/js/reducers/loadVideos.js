import LoadVideosActionTypes from '../constants/loadVideos';

export const initialState = {
    videos: null,
    videosDownloadError: null
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
    case LoadVideosActionTypes.LOAD_VIDEOS_SUCCESS:
        return {
            ...state,
            videosDownloadError: null,
            videos: action.payload
        };

    case LoadVideosActionTypes.LOAD_VIDEOS_ERROR:
        return {
            ...state,
            videosDownloadError: action.payload
        };

    default:
        // Do nothing
    }

    return state;
}
