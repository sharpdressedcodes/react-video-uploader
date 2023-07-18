import { FfprobeData, FfprobeStream } from 'fluent-ffmpeg';

// Note: Using custom overridden types because the type definition is wrong
// inside interface FfprobeStream => profile?: number | undefined;
// This should be string | undefined;
// Using number | string | undefined; to make it backwards compatible.
export type CustomFfprobeStream = Omit<FfprobeStream, 'profile'> & {
    profile?: number | string | undefined;
};

export type CustomFfprobeData = Omit<FfprobeData, 'streams'> & {
    streams: CustomFfprobeStream[];
};

export type LoadedVideoType = {
    video: string;
    uuid: string;
    timestamp: string;
    poster: string;
    thumb: string;
    animatedThumb: string;
    metadata: CustomFfprobeData;
    originalFileName: string;
    type: string;
    size: number;
    formattedSize: string;
};

export interface LoadVideosStateType {
    videos: Nullable<LoadedVideoType[]>;
    videosDownloadError: Nullable<string>
}

export type VideoStateType = {
    videoPlaybackError: Nullable<string>;
    video: Nullable<LoadedVideoType>;
};

export type GetVideosResultType = {
    item?: LoadedVideoType;
    items?: LoadedVideoType[];
    error: string;
};
