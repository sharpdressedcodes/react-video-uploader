import UploaderActionTypes from '../constants/uploader';

export const initialState = {
    uploadValidationErrors: [],
    uploadError: null,
    uploadUrl: null,
    uploadProgress: null,
    uploadResult: null
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
    case UploaderActionTypes.UPLOAD_START:
        return {
            ...initialState,
            uploadUrl: action.payload
        };

    case UploaderActionTypes.UPLOAD_SUCCESS:
        return {
            ...state,
            uploadValidationErrors: [],
            uploadError: null,
            uploadResult: action.payload
        };

    case UploaderActionTypes.UPLOAD_ERROR:
        return {
            ...initialState,
            uploadError: action.payload
        };

    case UploaderActionTypes.UPLOAD_VALIDATION_ERRORS:
        return {
            ...initialState,
            uploadValidationErrors: action.payload
        };

    case UploaderActionTypes.UPLOAD_PROGRESS:
        return {
            ...state,
            uploadProgress: action.payload
        };

    default:
        // Do nothing
    }

    return state;
}
