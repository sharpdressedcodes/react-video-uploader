// import UploaderActionTypes from '../constants/uploader';
// import VideoActionTypes from '../constants/video';
// import LoadVideosActionTypes from '../constants/loadVideos';
//
// const initialState = {
//     videoPlaybackError: null,
//     uploadValidationErrors: [],
//     uploadError: null,
//     uploadUrl: null,
//     uploadProgress: null,
//     uploadResult: null,
//     videos: null,
//     video: null,
//     videosDownloadError: null
// };
//
// function rootReducer(state = initialState, action) {
//
//     switch (action.type) {
//         case LoadVideosActionTypes.LOAD_VIDEOS_SUCCESS:
//             return {
//                 ...state,
//                 videos: action.payload,
//             };
//
//         case LoadVideosActionTypes.LOAD_VIDEOS_ERROR:
//             return {
//                 ...state,
//                 videosDownloadError: action.payload
//             };
//
//         case VideoActionTypes.VIDEO_PLAYBACK_ERROR:
//             return {
//                 ...state,
//                 videoPlaybackError: action.payload
//             };
//
//         case UploaderActionTypes.UPLOAD_START:
//             return {
//                 ...state,
//                 uploadUrl: action.payload
//             };
//
//         case UploaderActionTypes.UPLOAD_SUCCESS:
//             return {
//                 ...state,
//                 uploadResult: action.payload
//             };
//
//         case UploaderActionTypes.UPLOAD_ERROR:
//             return {
//                 ...state,
//                 uploadError: action.payload
//             };
//
//         case UploaderActionTypes.UPLOAD_VALIDATION_ERRORS:
//             return {
//                 ...state,
//                 uploadValidationErrors: action.payload
//             };
//
//         case UploaderActionTypes.UPLOAD_PROGRESS:
//             return {
//                 ...state,
//                 uploadProgress: action.payload
//             };
//
//         default:
//             // Do nothing
//     }
//
//     return state;
// }
//
// export default rootReducer;
