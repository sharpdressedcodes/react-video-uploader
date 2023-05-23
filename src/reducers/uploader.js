import ActionTypes from '../constants/uploader';

const {
    UPLOAD_START,
    UPLOAD_SUCCESS,
    UPLOAD_ERROR,
    UPLOAD_VALIDATION_ERRORS,
    UPLOAD_PROGRESS,
    UPLOAD_RESET,
} = ActionTypes;

export const initialState = {
    uploadValidationErrors: [],
    uploadError: null,
    uploadUrl: null,
    uploadProgress: null,
    uploadResult: null,
    //
    uploadValidation: null,
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case UPLOAD_START:
            return {
                ...initialState,
                uploadUrl: action.payload,
            };

        case UPLOAD_SUCCESS:
            return {
                ...state,
                uploadValidationErrors: [],
                uploadError: null,
                uploadResult: action.payload,
            };

        case UPLOAD_ERROR:
            return {
                ...initialState,
                uploadError: action.payload,
            };

        case UPLOAD_VALIDATION_ERRORS:
            return {
                ...initialState,
                // uploadValidationErrors: action.payload, // TODO: remove this
                uploadValidation: action.payload,
            };

        case UPLOAD_PROGRESS:
            return {
                ...state,
                uploadProgress: action.payload,
            };

        case UPLOAD_RESET:
            return {
                ...initialState,
            };

        default:
            // Do nothing
    }

    return state;
}
