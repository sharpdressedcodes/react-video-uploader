import { ComponentConfigType, defaultComponentConfig } from '../../../Form';
import { minEmailLength, maxEmailLength } from '../../../../common/validation/validateEmail';

const isTesting = process.env.NODE_ENV === 'test';
const labels = {
    email: 'Email address',
    message: 'Message',
    files: 'Files',
};
const messageMinLength = 3;
const messageMaxLength = 1000;
const maxFileSize = isTesting ? 10 : 1024 * 1024 * 150; // MB
const maxFiles = isTesting ? 5 : 10;
const maxTotalFileSize = isTesting ? 40 : maxFileSize * maxFiles;

const componentConfig: Record<string, ComponentConfigType> = {
    email: {
        ...defaultComponentConfig,
        label: labels.email,
        id: 'email',
        helpMessage: `${minEmailLength}-${maxEmailLength} characters. We will respond to this address.`,
        rules: {
            email: {
                label: labels.email,
            },
            required: {
                label: labels.email,
            },
        },
    },
    message: {
        ...defaultComponentConfig,
        label: labels.message,
        id: 'message',
        helpMessage: `${messageMinLength}-${messageMaxLength} characters.`,
        rules: {
            minLength: {
                value: messageMinLength,
                label: labels.message,
            },
            maxLength: {
                value: messageMaxLength,
                label: labels.message,
            },
            required: {
                label: labels.message,
            },
        },
    },
    files: {
        ...defaultComponentConfig,
        label: labels.files,
        id: 'files',
        helpMessage: 'Attach any relevant files.',
        rules: {
            maxArrayLength: {
                value: maxFiles,
                label: labels.files,
            },
            maxFileSize: {
                value: maxFileSize,
                label: labels.files,
            },
            maxTotalFileSize: {
                value: maxTotalFileSize,
                label: labels.files,
            },
        },
    },
};

export default componentConfig;
