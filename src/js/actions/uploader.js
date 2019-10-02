import ActionTypes from '../constants/uploader';

// export function uploadStart(context, payload) {
//     context.dispatch(ActionTypes.UPLOAD_START, payload);
// }
//
// export function uploadSuccess(context, payload) {
//     context.dispatch(ActionTypes.UPLOAD_SUCCESS, payload);
// }
//
// export function uploadError(context, payload) {
//     context.dispatch(ActionTypes.UPLOAD_ERROR, payload);
// }
//
// export function uploadValidationErrors(context, payload) {
//     context.dispatch(ActionTypes.UPLOAD_VALIDATION_ERRORS, payload);
// }
//
// export function uploadProgress(context, payload) {
//     context.dispatch(ActionTypes.UPLOAD_PROGRESS, payload);
// }

export function uploadStart(payload) {
    return { type: ActionTypes.UPLOAD_START, payload };
}

export function uploadSuccess(payload) {
    return { type: ActionTypes.UPLOAD_SUCCESS, payload };
}

export function uploadError(payload) {
    return { type: ActionTypes.UPLOAD_ERROR, payload };
}

export function uploadValidationErrors(payload) {
    return { type: ActionTypes.UPLOAD_VALIDATION_ERRORS, payload };
}

// export function uploadValidationErrors(payload) {
//     return dispatch => {
//         dispatch({ type: ActionTypes.UPLOAD_VALIDATION_ERRORS, payload });
//         return Promise.resolve();
//     };
//     //return { type: ActionTypes.UPLOAD_VALIDATION_ERRORS, payload };
// }

export function uploadProgress(payload) {
    return { type: ActionTypes.UPLOAD_PROGRESS, payload };
}
