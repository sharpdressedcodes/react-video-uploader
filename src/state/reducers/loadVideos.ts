/* eslint-disable no-param-reassign */
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
        loadVideosSuccess: (state, action: PayloadAction<LoadedVideoType[]>) => {
            state.videosDownloadError = null;
            state.videos = action.payload;

            return state;
        },
        loadVideosError: (state, action: PayloadAction<string>) => {
            state.videosDownloadError = action.payload;

            return state;
        },
    },
});

export const {
    loadVideosSuccess,
    loadVideosError,
} = loadVideosSlice.actions;

export default loadVideosSlice.reducer;
