import { ComponentConfigType, defaultComponentConfig } from '../../../Form';
import {
    videoFileExtensions as allowedFileExtensions,
    videoFileTypes as allowedFileTypes,
} from '../../../../config/fileTypes';

const isTesting = process.env.NODE_ENV === 'test';
const labels = {
    videos: 'Videos',
};
const maxFileSize = isTesting ? 10 : 1024 * 1024 * 150; // MB
const maxFiles = isTesting ? 5 : 10;
const maxTotalFileSize = isTesting ? 40 : maxFileSize * maxFiles;

const componentConfig: Record<string, ComponentConfigType> = {
    videos: {
        ...defaultComponentConfig,
        label: labels.videos,
        id: 'videos',
        helpMessage: [
            'Your videos will be converted to mp4 format.',
            'Thumbnail and animated thumbnail images will also be generated.',
        ].join(' '),
        rules: {
            allowedFileExtensions: {
                value: allowedFileExtensions,
                label: labels.videos,
            },
            // Used on server side only.
            allowedFileTypes: {
                value: allowedFileTypes,
                label: labels.videos,
            },
            maxArrayLength: {
                value: maxFiles,
                label: labels.videos,
                // errorTemplate: `Only ${maxFiles} files can be uploaded at a time.`,
            },
            maxFileSize: {
                value: maxFileSize,
                label: labels.videos,
            },
            maxTotalFileSize: {
                value: maxTotalFileSize,
                label: labels.videos,
            },
            required: {
                label: labels.videos,
            },
        },
    },
};

export default componentConfig;
