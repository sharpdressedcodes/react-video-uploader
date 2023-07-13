import { ComponentConfigType, defaultComponentConfig } from '../../../Form';
import {
    videoFileExtensions as allowedFileExtensions,
    videoFileTypes as allowedFileTypes,
} from '../../../../config/fileTypes';

const isTesting = process.env.NODE_ENV === 'test';
const labels = {
    username: 'Username',
    password: 'Password',
    file: 'Videos',
};
const usernameMinLength = 3;
const usernameMaxLength = 32;
const passwordMinLength = 3;
const passwordMaxLength = 32;
const maxFileSize = isTesting ? 10 : 1024 * 1024 * 150; // MB
const maxFiles = isTesting ? 5 : 10;
const maxTotalFileSize = isTesting ? 40 : maxFileSize * maxFiles;

const componentConfig: Record<string, ComponentConfigType> = {
    username: {
        ...defaultComponentConfig,
        label: labels.username,
        id: 'username',
        helpMessage: `${usernameMinLength}-${usernameMaxLength} characters. This will be used to sign in.`,
        rules: {
            minLength: {
                value: usernameMinLength,
                label: labels.username,
            },
            maxLength: {
                value: usernameMaxLength,
                label: labels.username,
            },
            required: {
                label: labels.username,
            },
        },
    },
    password: {
        ...defaultComponentConfig,
        label: labels.password,
        id: 'password',
        helpMessage: `${passwordMinLength}-${passwordMaxLength} characters. All characters allowed.`,
        rules: {
            minLength: {
                value: passwordMinLength,
                label: labels.password,
            },
            maxLength: {
                value: passwordMaxLength,
                label: labels.password,
            },
            required: {
                label: labels.password,
            },
        },
    },
    file: {
        ...defaultComponentConfig,
        label: labels.file,
        id: 'file',
        helpMessage: [
            'Your videos will be converted to mp4 format.',
            'Thumbnail and animated thumbnail images will also be generated.',
        ].join(' '),
        rules: {
            allowedFileExtensions: {
                value: allowedFileExtensions,
                label: labels.file,
            },
            // Used on server side only.
            allowedFileTypes: {
                value: allowedFileTypes,
                label: labels.file,
            },
            maxArrayLength: {
                value: maxFiles,
                label: labels.file,
                // errorTemplate: `Only ${maxFiles} files can be uploaded at a time.`,
            },
            maxFileSize: {
                value: maxFileSize,
                label: labels.file,
            },
            maxTotalFileSize: {
                value: maxTotalFileSize,
                label: labels.file,
            },
            required: {
                label: labels.file,
            },
        },
    },
};

export default componentConfig;
