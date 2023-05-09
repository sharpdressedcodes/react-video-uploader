import axios from 'axios';

const upload = ({ url, data, onProgress, options = {} }) => axios.post(url, data, {
    ...options,
    adapter: 'xhr',
    onUploadProgress: onProgress,
});

export default upload;
