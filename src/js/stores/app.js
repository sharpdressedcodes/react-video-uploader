import { BaseStore } from 'fluxible/addons';
import axios from 'axios';
import xhrAdapter from 'axios/lib/adapters/xhr';
import VideoActionTypes from '../constants/video';
import UploaderActionTypes from '../constants/uploader';

const { VIDEO_PLAYBACK_ERROR } = VideoActionTypes;
const {
    UPLOAD_START, UPLOAD_SUCCESS, UPLOAD_ERROR, UPLOAD_VALIDATION_ERRORS, UPLOAD_PROGRESS,
} = UploaderActionTypes;

class AppStore extends BaseStore {
    static storeName = 'AppStore';

    constructor(dispatcher) {
        super(dispatcher);

        this.videos = [];
        this.videosDownloadError = null;
        this.videoPlaybackError = null;
        this.uploadValidationErrors = [];
        this.uploadError = null;
        this.uploadUrl = null;
        this.uploadProgress = null;
        this.uploadResult = null;

        this.loadVideoList();
    }

    // Getters
    getState() {
        return {
            videos: this.videos,
            videosDownloadError: this.videosDownloadError,
            videoPlaybackError: this.videoPlaybackError,
            uploadValidationErrors: this.uploadValidationErrors,
            uploadErrors: this.uploadErrors,
            uploadUrl: this.uploadUrl,
            uploadProgress: this.uploadProgress,
            uploadResult: this.uploadResult,
        };
    }

    getVideos() {
        return this.videos;
    }

    getVideo(id) {
        return this.videos[id];
    }

    getVideosDownloadError() {
        return this.videosDownloadError;
    }

    getVideoPlaybackError() {
        return this.videoPlaybackError;
    }

    getUploadValidationErrors() {
        return this.uploadValidationErrors;
    }

    getUploadError() {
        return this.uploadError;
    }

    getUploadUrl() {
        return this.uploadUrl;
    }

    getUploadProgress() {
        return this.uploadProgress;
    }

    getUploadResult() {
        return this.uploadResult;
    }

    // Handlers
    onLoadVideos(payload) {
        this.videos = payload.videos;
        this.emitChange();
    }

    onLoadVideosError(payload) {
        this.videosDownloadError = payload.error;
        this.emitChange();
        this.videosDownloadError = null;
        this.emitChange();
    }

    onVideoPlaybackError(payload) {
        this.videoPlaybackError = payload.error;
        this.emitChange();
        this.videoPlaybackError = null;
        this.emitChange();
    }

    onUploadValidationErrors(payload) {
        this.uploadValidationErrors = payload.errors;
        this.emitChange();
        this.uploadValidationErrors = [];
        this.emitChange();
    }

    onUploadError(payload) {
        this.uploadError = payload.error;
        this.emitChange();
        this.uploadError = null;
        this.emitChange();
    }

    onUploadStart(payload) {
        this.uploadUrl = payload.url;
        this.emitChange();
    }

    onUploadProgress(payload) {
        this.uploadProgress = payload.percentage;
        this.emitChange();
    }

    onUploadSuccess(payload) {
        this.uploadResult = payload.result;
        this.emitChange();
        this.uploadResult = null;
        this.emitChange();
    }

    // Methods
    loadVideoList() {
        const { config } = this.getContext();

        axios.get(config.app.endpoints.api.video.get, { adapter: xhrAdapter })
            .then(response => {
                this.onLoadVideos({ videos: response.data.items });
            })
            .catch(err => {
                this.onLoadVideosError({ error: err.message });
            });
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.videos = state.videos;
        this.videosDownloadError = state.videosDownloadError;
        this.videoPlaybackError = state.videoPlaybackError;
        this.uploadValidationErrors = state.uploadValidationErrors;
        this.uploadError = state.uploadError;
        this.uploadUrl = state.uploadUrl;
        this.uploadProgress = state.uploadProgress;
        this.uploadResult = state.uploadResult;
    }
}

AppStore.handlers = {};
AppStore.handlers[VIDEO_PLAYBACK_ERROR] = 'onVideoPlaybackError';
AppStore.handlers[UPLOAD_VALIDATION_ERRORS] = 'onUploadValidationErrors';
AppStore.handlers[UPLOAD_ERROR] = 'onUploadError';
AppStore.handlers[UPLOAD_START] = 'onUploadStart';
AppStore.handlers[UPLOAD_SUCCESS] = 'onUploadSuccess';
AppStore.handlers[UPLOAD_PROGRESS] = 'onUploadProgress';

export default AppStore;
