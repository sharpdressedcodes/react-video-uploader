import axios from 'axios';
import adapter from 'axios/lib/adapters/xhr';

const upload = ({ url, data, onProgress, options = {} }) => axios.post(url, data, {
    ...options,
    adapter,
    onUploadProgress: onProgress,
});

export default upload;
