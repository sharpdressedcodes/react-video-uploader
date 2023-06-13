import { getObjectValue } from '../common';
import {
    FileTypesType,
    fileTypes as allowedFileTypes,
    fileExtensions as allowedFileExtensions,
} from './fileTypes';

export type GetConfigType = <T>(key: string, defaultValue?: T) => T;

export type FeatureToggleConfigType = {
    enabled?: boolean;
};

export type StreamingConfigType = FeatureToggleConfigType;

export type ConnectionConfigType = {
    hostName: string;
    port: number;
    streaming: StreamingConfigType;
};

export type VideoUploadConfigType = {
    thumbnailDimensions: string;
    maxFiles: number;
    maxFileSize: number;
    maxTotalFileSize: number;
    path: string;
    publicPath: string;
};

export type VideoApiEndpointsConfigType = {
    upload: string;
    get: string;
};

export type ApiEndpointsConfigType = {
    video: VideoApiEndpointsConfigType;
};

export type EndpointsConfigType = {
    api: ApiEndpointsConfigType;
};

export type ManifestConfigType = {
    fileName: string;
};

export type ServiceWorkerConfigType = FeatureToggleConfigType;

export type WebVitalsConfigType = FeatureToggleConfigType & {
    callback?: (...args: any[]) => void;
};

export type ConfigType = {
    allowedFileTypes: Record<string, FileTypesType>;
    allowedFileExtensions: string[];
    appName: string;
    server: ConnectionConfigType;
    videoUpload: VideoUploadConfigType;
    endpoints: EndpointsConfigType;
    manifest: ManifestConfigType;
    serviceWorker: ServiceWorkerConfigType;
    webVitals: WebVitalsConfigType;
    get: GetConfigType;
};

const publicPath = 'data/uploads';
const path = `build/browser/${publicPath}`;
const maxFileSize = 1024 * 1024 * 150; // MB
const maxFiles = 10;
const appName = 'Video Uploader';
const config = {
    allowedFileTypes,
    allowedFileExtensions,
    appName,
    server: {
        hostName: '0.0.0.0',
        port: 3000,
        streaming: {
            enabled: true,
        },
    },
    videoUpload: {
        thumbnailDimensions: '320x180', // 16:9
        maxFiles,
        maxFileSize,
        maxTotalFileSize: maxFileSize * maxFiles,
        path,
        publicPath,
    },
    endpoints: {
        api: {
            video: {
                upload: '/api/video/upload',
                get: '/api/video/get',
            },
        },
    },
    manifest: {
        fileName: '/manifest.json',
    },
    serviceWorker: {
        // enabled: process.env.NODE_ENV === 'production',
        // TODO: fix sw issue in production
        enabled: false,
    },
    webVitals: {
        // eslint-disable-next-line no-console
        callback: console.log,
        // enabled: process.env.NODE_ENV === 'development',
        enabled: false,
    },
    get: <T>(key: string, defaultValue: any) => defaultValue,
};

export const testConfig = {
    ...config,
    videoUpload: {
        ...config.videoUpload,
        maxFiles: 5,
        maxFileSize: 10,
        maxTotalFileSize: 40,
    },
    serviceWorker: {
        enabled: false,
    },
    webVitals: {
        enabled: false,
    },
};

// Override `get` methods to automatically check the current config object
config.get = <T>(key: string, defaultValue: T): GetConfigType => getObjectValue(config, key, defaultValue);
testConfig.get = <T>(key: string, defaultValue: T): GetConfigType => getObjectValue(testConfig, key, defaultValue);

export default config;
