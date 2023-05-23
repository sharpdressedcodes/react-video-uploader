import ActionTypes from '../constants/uploader';

const {
    UPLOAD_START,
    UPLOAD_SUCCESS,
    UPLOAD_ERROR,
    UPLOAD_VALIDATION_ERRORS,
    UPLOAD_PROGRESS,
    UPLOAD_RESET,
} = ActionTypes;

export function uploadStart(payload) {
    return { type: UPLOAD_START, payload };
}

export function uploadSuccess(payload) {
    return { type: UPLOAD_SUCCESS, payload };
}

export function uploadError(payload) {
    return { type: UPLOAD_ERROR, payload };
}

export function uploadValidationErrors(payload) {
    return { type: UPLOAD_VALIDATION_ERRORS, payload };
}

export function uploadProgress(payload) {
    return { type: UPLOAD_PROGRESS, payload };
}

export function uploadReset() {
    return { type: UPLOAD_RESET, payload: null };
}
