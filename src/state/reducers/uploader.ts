/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileValidationValidationType } from '../../common/validation/fileValidation';
import { GetVideosResultType } from '../types';

export type UploaderStateType = {
    uploadError: Nullable<string>;
    uploadUrl: Nullable<string>;
    uploadProgress: Nullable<number>;
    uploadResult: Nullable<GetVideosResultType>;
    uploadValidation: Nullable<FileValidationValidationType>;

    error: Nullable<string>;
    url: Nullable<string>;
    progress: Nullable<number>;
    result: Nullable<GetVideosResultType>;
    validation: Nullable<FileValidationValidationType>;
};

export const initialState: UploaderStateType = {
    uploadError: null,
    uploadUrl: null,
    uploadProgress: null,
    uploadResult: null,
    uploadValidation: null,

    error: null,
    url: null,
    progress: null,
    result: null,
    validation: null,
};

const resetState = (state: Record<string, any>) => {
    Object.entries(initialState).forEach(([key, value]) => {
        state[key] = value;
    });
};

export const uploaderSlice = createSlice({
    name: 'uploader',
    initialState,
    reducers: {
        uploadStart: (state, action: PayloadAction<string>) => {
            resetState(state);
            state.uploadUrl = action.payload;
            state.url = action.payload;

            return state;
        },
        uploadSuccess: (state, action: PayloadAction<GetVideosResultType>) => {
            state.uploadError = initialState.uploadError;
            state.uploadResult = action.payload;

            state.error = initialState.error;
            state.result = action.payload;

            return state;
        },
        uploadError: (state, action: PayloadAction<string>) => {
            resetState(state);
            state.uploadError = action.payload;
            state.error = action.payload;

            return state;
        },
        uploadValidationErrors: (state, action: PayloadAction<FileValidationValidationType>) => {
            resetState(state);
            state.uploadValidation = action.payload;
            state.validation = action.payload;

            return state;
        },
        uploadProgress: (state, action: PayloadAction<number>) => {
            state.uploadProgress = action.payload;
            state.progress = action.payload;

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
