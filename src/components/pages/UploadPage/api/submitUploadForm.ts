import axios from 'axios';
import { DefaultSubmitUploadFormPropsType, SubmitUploadFormPropsType } from '../types';

export const defaultProps: DefaultSubmitUploadFormPropsType = {
    onProgress: () => {},
    options: {},
};

const submitUploadForm = ({
    url,
    data,
    onProgress = defaultProps.onProgress,
    options = defaultProps.options,
}: SubmitUploadFormPropsType) => axios.post(url, data, {
    adapter: 'xhr',
    headers: { 'x-csrf-token': window.reactCsrfToken },
    onUploadProgress: onProgress,
    ...options,
});

export default submitUploadForm;
