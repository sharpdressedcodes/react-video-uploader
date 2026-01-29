import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoadedVideoType, LoadVideosStateType } from '../types';

export const initialState: LoadVideosStateType = {
    videos: null,
    videosDownloadError: null,
};

export const loadVideosSlice = createSlice({
    name: 'loadVideos',
    initialState,
    reducers: {
        loadVideosSuccess: (state, action: PayloadAction<LoadedVideoType[]>) => ({
            ...state,
            videosDownloadError: null,
            videos: action.payload,
        }),
        loadVideosError: (state, action: PayloadAction<string>) => ({
            ...state,
            videosDownloadError: action.payload,
        }),
    },
});

export const {
    loadVideosSuccess,
    loadVideosError,
} = loadVideosSlice.actions;

export default loadVideosSlice.reducer;
