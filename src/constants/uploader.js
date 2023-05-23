import keyMirror from 'keymirror';

const ActionTypes = keyMirror({
    UPLOAD_START: null,
    UPLOAD_SUCCESS: null,
    UPLOAD_ERROR: null,
    UPLOAD_VALIDATION_ERRORS: null,
    UPLOAD_PROGRESS: null,
    UPLOAD_RESET: null,
});

export default ActionTypes;
