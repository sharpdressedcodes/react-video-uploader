/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    uploadValidationErrors: [],
    uploadError: null,
    uploadUrl: null,
    uploadProgress: null,
    uploadResult: null,
    uploadValidation: null,
};

const resetState = state => {
    Object.entries(initialState).forEach(([key, value]) => {
        state[key] = value;
    });
};

export const uploaderSlice = createSlice({
    name: 'uploader',
    initialState,
    reducers: {
        uploadStart: (state, action) => {
            resetState(state);
            state.uploadUrl = action.payload;

            return state;
        },
        uploadSuccess: (state, action) => {
            state.uploadValidationErrors = initialState.uploadValidationErrors;
            state.uploadError = initialState.uploadError;
            state.uploadResult = action.payload;

            return state;
        },
        uploadError: (state, action) => {
            resetState(state);
            state.uploadError = action.payload;

            return state;
        },
        uploadValidationErrors: (state, action) => {
            resetState(state);
            state.uploadValidation = action.payload;

            return state;
        },
        uploadProgress: (state, action) => {
            state.uploadProgress = action.payload;

            return state;
        },
        uploadReset: () => initialState,
    },
});

export const {
    uploadStart,
    uploadSuccess,
    uploadError,
    uploadValidationErrors,
    uploadProgress,
    uploadReset,
} = uploaderSlice.actions;

export default uploaderSlice.reducer;
