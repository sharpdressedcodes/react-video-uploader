import ActionTypes from '../constants/uploader';

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

export function uploadProgress(payload) {
    return { type: ActionTypes.UPLOAD_PROGRESS, payload };
}
