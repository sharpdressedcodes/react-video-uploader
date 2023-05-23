/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    videoPlaybackError: null,
    video: null,
};

export const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        videoPlaybackError: (state, action) => {
            state.videoPlaybackError = action.payload;

            return state;
        },
    },
});

export const { videoPlaybackError } = videoSlice.actions;

export default videoSlice.reducer;
