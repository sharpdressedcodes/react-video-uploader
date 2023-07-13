import axios from 'axios';
import { DefaultSubmitContactFormPropsType, SubmitContactFormPropsType } from '../types';

export const defaultProps: DefaultSubmitContactFormPropsType = {
    onProgress: () => {},
    options: {},
};

const submitContactForm = ({
    url,
    data,
    onProgress = defaultProps.onProgress,
    options = defaultProps.options,
}: SubmitContactFormPropsType) => axios.post(url, data, {
    adapter: 'xhr',
    headers: { 'x-csrf-token': window.reactCsrfToken },
    onUploadProgress: onProgress,
    ...options,
});

export default submitContactForm;
