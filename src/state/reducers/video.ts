import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VideoStateType } from '../types';

export const initialState: VideoStateType = {
    videoPlaybackError: null,
    video: null,
};

export const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        videoPlaybackError: (state, action: PayloadAction<string>) => ({
            ...state,
            videoPlaybackError: action.payload,
        }),
    },
});

export const { videoPlaybackError } = videoSlice.actions;

export default videoSlice.reducer;
