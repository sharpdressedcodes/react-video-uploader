import ActionTypes from '../constants/uploader';

export function uploadStart(context, payload) {
    context.dispatch(ActionTypes.UPLOAD_START, payload);
}

export function uploadSuccess(context, payload) {
    context.dispatch(ActionTypes.UPLOAD_SUCCESS, payload);
}

export function uploadError(context, payload) {
    context.dispatch(ActionTypes.UPLOAD_ERROR, payload);
}

export function uploadValidationErrors(context, payload) {
    context.dispatch(ActionTypes.UPLOAD_VALIDATION_ERRORS, payload);
}

export function uploadProgress(context, payload) {
    context.dispatch(ActionTypes.UPLOAD_PROGRESS, payload);
}
