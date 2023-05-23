/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    videos: null,
    videosDownloadError: null,
};

export const loadVideosSlice = createSlice({
    name: 'loadVideos',
    initialState,
    reducers: {
        loadVideosSuccess: (state, action) => {
            state.videosDownloadError = null;
            state.videos = action.payload;

            return state;
        },
        loadVideosError: (state, action) => {
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
