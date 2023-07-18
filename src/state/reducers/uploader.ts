/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetVideosResultType } from '../types';

export type UploaderStateType = {
    error: Nullable<string>;
    url: Nullable<string>;
    progress: Nullable<number>;
    result: Nullable<GetVideosResultType>;
};

export const initialState: UploaderStateType = {
    error: null,
    url: null,
    progress: null,
    result: null,
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
            state.url = action.payload;

            return state;
        },
        uploadSuccess: (state, action: PayloadAction<GetVideosResultType>) => {
            state.error = initialState.error;
            state.result = action.payload;

            return state;
        },
        uploadError: (state, action: PayloadAction<string>) => {
            resetState(state);
            state.error = action.payload;

            return state;
        },
        uploadProgress: (state, action: PayloadAction<number>) => {
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
    uploadProgress,
    uploadReset,
} = uploaderSlice.actions;

export default uploaderSlice.reducer;
