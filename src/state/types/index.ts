import { FfprobeData } from 'fluent-ffmpeg';

export type LoadedVideoType = {
    video: string;
    uuid: string;
    timestamp: string;
    poster: string;
    thumb: string;
    animatedThumb: string;
    metadata: FfprobeData;
    originalFileName: string;
    type: string;
    size: number;
    formattedSize: string;
}

export interface LoadVideosStateType {
    videos: Nullable<LoadedVideoType[]>;
    videosDownloadError: Nullable<string>
}

export type VideoStateType = {
    videoPlaybackError: Nullable<string>;
    video: Nullable<LoadedVideoType>;
}

export type GetVideosResultType = {
    item?: LoadedVideoType;
    items?: LoadedVideoType[];
    error: string;
}
