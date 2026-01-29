import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetVideosResultType, UploaderStateType } from '../types';

export const initialState: UploaderStateType = {
    error: null,
    url: null,
    progress: null,
    result: null,
};

export const uploaderSlice = createSlice({
    name: 'uploader',
    initialState,
    reducers: {
        uploadStart: (state, action: PayloadAction<string>) => ({
            ...initialState,
            url: action.payload,
        }),
        uploadSuccess: (state, action: PayloadAction<GetVideosResultType>) => ({
            ...state,
            error: initialState.error,
            result: action.payload,
        }),
        uploadError: (state, action: PayloadAction<string>) => ({
            ...initialState,
            error: action.payload,
        }),
        uploadProgress: (state, action: PayloadAction<number>) => ({
            ...state,
            progress: action.payload,
        }),
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
