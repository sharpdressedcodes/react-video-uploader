import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
    uploadError,
    uploadProgress,
    uploadStart,
    uploadSuccess,
    uploadValidationErrors,
    uploadReset,
} from '../../../actions/uploader';
import { fileValidation, formatFileSize, isArrayEmpty, SimpleWebSocket } from '../../../common';
import { upload } from '../api';

const Uploader = ({ allowedFileExtensions, className, maxFiles, maxFileSize, maxTotalFileSize, multiple, progress, url }) => {
    const [loaded, setLoaded] = useState(Uploader.DEFAULT_STATE.loaded);
    const [selectedFiles, setSelectedFiles] = useState(Uploader.DEFAULT_STATE.selectedFiles);
    const [uploading, setUploading] = useState(Uploader.DEFAULT_STATE.uploading);
    const [uploadedFiles, setUploadedFiles] = useState(Uploader.DEFAULT_STATE.uploadedFiles);
    const webSocket = useRef(null);
    const dispatch = useDispatch();

    const dispatchAndWait = action => new Promise(resolve => {
        dispatch(action);
        setTimeout(resolve);
    });
    const onWebSocketOpen = event => {
        // console.log('websocket open', event);
    };
    const onWebSocketError = err => {
        // console.log('websocket error', err);
    };
    const onWebSocketClose = event => {
        // console.log('websocket close', event);
    };
    const onUploadStep = params => {
        const { step, total, status } = params;
        /* step: 3,
        total: 3,
        status: 'Parsing' */
        // console.log('---> onUploadStep', params);

        // if (step === total) {
        //     this.setState({ uploadedFiles: [] });
        // }
    };
    const onUploadStepFile = params => {
        const { index } = params;

        uploadedFiles[index] = params;
        setUploadedFiles([...uploadedFiles]);
    };
    const onUploadStepFileProgress = params => {
        const { index } = params;

        uploadedFiles[index] = params;
        setUploadedFiles([...uploadedFiles]);
        // console.log('upload.step.file.progress', params);
    };
    const onUploadProgress = ProgressEvent => {
        const percentage = (ProgressEvent.loaded / ProgressEvent.total) * 100;

        dispatch(uploadProgress(percentage));
        setLoaded(percentage);
    };
    const onChange = async event => {
        const files = Array.from(event.target.files);

        if (isArrayEmpty(files)) {
            // User opened dialog, then clicked cancel
            setLoaded(Uploader.DEFAULT_STATE.loaded);
            setSelectedFiles(Uploader.DEFAULT_STATE.selectedFiles);
            setUploading(Uploader.DEFAULT_STATE.uploading);
            setUploadedFiles(Uploader.DEFAULT_STATE.uploadedFiles);
            return;
        }

        await dispatchAndWait(uploadReset());

        const result = await fileValidation({
            files,
            allowedFileExtensions,
            maxFiles,
            maxFileSize,
            maxTotalFileSize,
        });

        if (!result.success) {
            // eslint-disable-next-line no-param-reassign
            event.target.value = null;
            dispatch(uploadValidationErrors(result));
        } else {
            setSelectedFiles(files);
            setUploadedFiles([]);
        }

        setLoaded(Uploader.DEFAULT_STATE.loaded);
        setUploading(Uploader.DEFAULT_STATE.uploading);
    };
    const onSubmit = async event => {
        const data = new FormData();

        event.preventDefault();
        await dispatchAndWait(uploadReset());

        if (!selectedFiles) {
            dispatch(uploadError('Error: No files selected'));
            return;
        }

        selectedFiles.forEach(file => {
            data.append('file', file);
        });

        try {
            setLoaded(Uploader.DEFAULT_STATE.loaded);
            setUploading(true);
            dispatch(uploadStart(url));

            const result = await upload({ url, data, onProgress: onUploadProgress });

            if (result.data.validation) {
                dispatch(uploadValidationErrors(result.data.validation));
            } else {
                dispatch(uploadSuccess(result.data));
            }
        } catch (err) {
            dispatch(uploadError(err.message));
        } finally {
            setLoaded(Uploader.DEFAULT_STATE.loaded);
            setUploadedFiles(Uploader.DEFAULT_STATE.uploadedFiles);
            setUploading(Uploader.DEFAULT_STATE.uploading);
            // Uncomment below to auto reset after upload
            // setSelectedFiles(Uploader.DEFAULT_STATE.selectedFiles);
        }
    };
    const onWebSocketMessage = event => {
        // console.log('websocket message', event);
        const message = JSON.parse(event.data);

        switch (message.event) {
            case 'upload.step':
                onUploadStep(message.data);
                break;
            case 'upload.step.file':
                onUploadStepFile(message.data);
                break;
            case 'upload.step.file.progress':
                onUploadStepFileProgress(message.data);
                break;
            default:
        }
    };
    const renderFiles = () => {
        if (!selectedFiles) {
            return <span>No files selected</span>;
        }

        return (
            <ul className="files">
                {selectedFiles.map((item, index) => {
                    const uploadItem = uploadedFiles[index];
                    const s = uploadItem?.status
                        ? `Step ${uploadItem.step} of ${uploadItem.total} - ${uploadItem.status}`
                        : 'Ready to upload';

                    return (
                        <li key={ item.name } className="file">
                            <span className="file-index">{index + 1}.</span>
                            <span className="file-name">{item.name}</span>
                            <span className="file-size">{formatFileSize(item.size)}</span>
                            <span className="file-status">{s}</span>
                            <span className="file-progress">
                                <LinearProgress
                                    className="status-progress"
                                    variant="determinate"
                                    value={ uploadItem?.percent ?? 0 }
                                />
                            </span>
                        </li>
                    );
                })}
            </ul>
        );
    };
    const renderProgress = () => {
        if (progress && selectedFiles) {
            return <LinearProgress className="status-progress" variant="determinate" value={ loaded } />;
        }

        return null;
    };

    useEffect(() => {
        if (!webSocket.current) {
            webSocket.current = new SimpleWebSocket();

            webSocket.current.addEventListeners({
                onOpen: onWebSocketOpen,
                onMessage: onWebSocketMessage,
                onError: onWebSocketError,
                onClose: onWebSocketClose,
            });
        }

        return () => {
            if (webSocket.current) {
                webSocket.current.removeEventListeners({
                    onOpen: onWebSocketOpen,
                    onMessage: onWebSocketMessage,
                    onError: onWebSocketError,
                    onClose: onWebSocketClose,
                });

                webSocket.current = null;
            }
        };
    }, [allowedFileExtensions, className, maxFiles, maxFileSize, maxTotalFileSize, multiple, progress, url]);

    const selectButtonAttributes = {
        variant: 'contained',
        component: 'label',
        color: 'secondary',
    };
    const submitButtonAttributes = {
        variant: 'contained',
        component: 'button',
        type: 'submit',
    };
    const inputAttributes = {
        style: { display: 'none' },
        type: 'file',
        name: 'file',
        onChange,
    };
    const files = renderFiles();
    const progressElement = renderProgress();

    if (!isArrayEmpty(allowedFileExtensions)) {
        inputAttributes.accept = allowedFileExtensions.map(f => `.${f}`).join(',');
    }

    if (!selectedFiles || uploading) {
        submitButtonAttributes.disabled = true;
    }

    if (uploading) {
        selectButtonAttributes.disabled = true;
    }

    if (multiple) {
        inputAttributes.multiple = true;
    }

    return (
        <section className={ classNames('uploader', className) }>
            <form className="form form-upload" action={ url } method="post" onSubmit={ onSubmit }>
                <div className="form-fields">
                    <div className="form-field">
                        <Button { ...selectButtonAttributes }>
                            Select Files
                            <AddIcon className="button-icon-right" />
                            <input { ...inputAttributes } />
                        </Button>
                    </div>
                </div>

                <div className="form-controls">
                    <Button { ...submitButtonAttributes }>
                        Upload
                        <CloudUploadIcon className="button-icon-right" />
                    </Button>
                </div>
            </form>

            <div className="status">
                <div className="status-files">{files}</div>
                {progressElement}
            </div>
        </section>
    );
};

Uploader.displayName = 'Uploader';

Uploader.DEFAULT_STATE = {
    selectedFiles: null,
    loaded: 0,
    uploading: false,
    uploadedFiles: [],
};

Uploader.propTypes = {
    url: PropTypes.string.isRequired,
    allowedFileExtensions: PropTypes.arrayOf(PropTypes.string),
    className: PropTypes.string,
    maxFiles: PropTypes.number,
    maxFileSize: PropTypes.number,
    maxTotalFileSize: PropTypes.number,
    multiple: PropTypes.bool,
    progress: PropTypes.bool,
};

Uploader.defaultProps = {
    allowedFileExtensions: [],
    className: null,
    maxFiles: 0,
    maxFileSize: 0,
    maxTotalFileSize: 0,
    multiple: false,
    progress: false,
};

export default memo(Uploader);
