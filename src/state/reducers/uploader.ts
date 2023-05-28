/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileValidationValidationType } from '../../common/fileValidation';
import { GetVideosResultType } from '../types';

export type UploaderStateType = {
    uploadError: Nullable<string>;
    uploadUrl: Nullable<string>;
    uploadProgress: Nullable<number>;
    uploadResult: Nullable<GetVideosResultType>;
    uploadValidation: Nullable<FileValidationValidationType>;
}

export const initialState: UploaderStateType = {
    uploadError: null,
    uploadUrl: null,
    uploadProgress: null,
    uploadResult: null,
    uploadValidation: null,
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

            return state;
        },
        uploadSuccess: (state, action: PayloadAction<GetVideosResultType>) => {
            state.uploadError = initialState.uploadError;
            state.uploadResult = action.payload;

            return state;
        },
        uploadError: (state, action: PayloadAction<string>) => {
            resetState(state);
            state.uploadError = action.payload;

            return state;
        },
        uploadValidationErrors: (state, action: PayloadAction<FileValidationValidationType>) => {
            resetState(state);
            state.uploadValidation = action.payload;

            return state;
        },
        uploadProgress: (state, action: PayloadAction<number>) => {
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
