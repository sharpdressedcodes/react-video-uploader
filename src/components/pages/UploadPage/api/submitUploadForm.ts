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
    ...options,
    adapter: 'xhr',
    onUploadProgress: onProgress,
});

export default submitUploadForm;
