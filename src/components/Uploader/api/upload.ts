import axios from 'axios';
import { DefaultApiUploadPropsType, ApiUploadPropsType } from '../types';

export const defaultProps: DefaultApiUploadPropsType = {
    onProgress: () => { return; },
    options: {},
};

const upload = ({
    url,
    data,
    onProgress = defaultProps.onProgress,
    options = defaultProps.options,
}: ApiUploadPropsType) => axios.post(url, data, {
    ...options,
    adapter: 'xhr',
    onUploadProgress: onProgress,
});

export default upload;
