import React, { ChangeEvent, FormEvent, HTMLAttributes, HTMLProps, memo, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { AnyAction } from '@reduxjs/toolkit';
import Button, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { AxiosProgressEvent } from 'axios';
import {
    uploadError,
    uploadProgress,
    uploadStart,
    uploadSuccess,
    uploadValidationErrors,
    uploadReset,
} from '../../../state/reducers/uploader';
import { useAppDispatch } from '../../../state/hooks';
import { fileValidation, formatFileSize, isArrayEmpty, SimpleWebSocket } from '../../../common';
import { upload } from '../api';
import { StateType, DefaultPropsType, PropsType } from '../types';
import { UploadStepType, UploadFileStepType, UploadProgressStepType } from '../../../server/types';

export const DEFAULT_STATE: StateType = {
    selectedFiles: null,
    loaded: 0,
    uploading: false,
    uploadedFiles: [],
};

export const defaultProps: DefaultPropsType = {
    allowedFileExtensions: [],
    maxFiles: 0,
    maxFileSize: 0,
    maxTotalFileSize: 0,
    multiple: false,
    progress: false,
};

const Uploader = ({
    allowedFileExtensions = defaultProps.allowedFileExtensions,
    className,
    maxFiles = defaultProps.maxFiles,
    maxFileSize = defaultProps.maxFileSize,
    maxTotalFileSize = defaultProps.maxTotalFileSize,
    multiple = defaultProps.multiple,
    progress = defaultProps.progress,
    url,
}: PropsType) => {
    const [loaded, setLoaded] = useState(Uploader.DEFAULT_STATE.loaded);
    const [selectedFiles, setSelectedFiles] = useState(Uploader.DEFAULT_STATE.selectedFiles);
    const [uploading, setUploading] = useState(Uploader.DEFAULT_STATE.uploading);
    const [uploadedFiles, setUploadedFiles] = useState(Uploader.DEFAULT_STATE.uploadedFiles);
    const webSocket = useRef<Nullable<SimpleWebSocket>>(null);
    const dispatch = useAppDispatch();

    const dispatchAndWait = (action: AnyAction) => new Promise(resolve => {
        dispatch(action);
        setTimeout(resolve);
    });
    const onWebSocketOpen = (event: Event) => {
        // console.log('websocket open', event);
    };
    const onWebSocketError = (event: Event) => {
        // console.log('websocket error', event);
    };
    const onWebSocketClose = (event: Event) => {
        // console.log('websocket close', event);
    };
    const onUploadStep = (params: UploadStepType) => {
        const { step, total, status } = params;
        /* step: 3,
        total: 3,
        status: 'Parsing' */
        // console.log('---> onUploadStep', params);

        // if (step === total) {
        //     this.setState({ uploadedFiles: [] });
        // }
    };
    const onUploadStepFile = (params: UploadFileStepType) => {
        const { index } = params;

        uploadedFiles[index] = params;
        setUploadedFiles([...uploadedFiles]);
    };
    const onUploadStepFileProgress = (params: UploadProgressStepType) => {
        const { index } = params;

        uploadedFiles[index] = params;
        setUploadedFiles([...uploadedFiles]);
        // console.log('upload.step.file.progress', params);
    };
    const onUploadProgress = (ProgressEvent: AxiosProgressEvent) => {
        const total = ProgressEvent?.total || 0;
        const percentage = (ProgressEvent.loaded / total) * 100;

        dispatch(uploadProgress(percentage));
        setLoaded(percentage);
    };
    const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
        // const files = Array.from(event.target.files);
        // const files = Array.from((event?.target as unknown as { files: File[] }).files);
        const files = Array.from((event.target as HTMLInputElement).files as FileList);
        // const files = Array.from(event.currentTarget.files);

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
            event.target.value = '';
            dispatch(uploadValidationErrors(result));
        } else {
            setSelectedFiles(files);
            setUploadedFiles([]);
        }

        setLoaded(Uploader.DEFAULT_STATE.loaded);
        setUploading(Uploader.DEFAULT_STATE.uploading);
    };
    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
        } catch (err: unknown) {
            dispatch(uploadError((err as Error).message));
        } finally {
            setLoaded(Uploader.DEFAULT_STATE.loaded);
            setUploadedFiles(Uploader.DEFAULT_STATE.uploadedFiles);
            setUploading(Uploader.DEFAULT_STATE.uploading);
            // Uncomment below to auto reset after upload
            // setSelectedFiles(Uploader.DEFAULT_STATE.selectedFiles);
        }
    };
    const onWebSocketMessage = (event: MessageEvent) => {
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
                    const s = uploadItem?.status ?
                        `Step ${uploadItem.step} of ${uploadItem.total} - ${uploadItem.status}` :
                        'Ready to upload';

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
                                    value={ (uploadItem as UploadProgressStepType)?.percent ?? 0 }
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

    const selectButtonAttributes: MuiButtonProps<'label', { component: 'label' }> = {
        variant: 'contained',
        component: 'label',
        color: 'secondary',
    };
    const submitButtonAttributes: MuiButtonProps<'button', { component: 'button' }> = {
        variant: 'contained',
        component: 'button',
        type: 'submit',
    };
    const inputAttributes: HTMLProps<HTMLInputElement> & HTMLAttributes<HTMLInputElement> = {
        style: { display: 'none' },
        type: 'file',
        name: 'file',
        onChange,
    };
    const files = renderFiles();
    const progressElement = renderProgress();

    if (!isArrayEmpty(allowedFileExtensions)) {
        inputAttributes.accept = allowedFileExtensions?.map(f => `.${f}`).join(',');
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

Uploader.DEFAULT_STATE = DEFAULT_STATE;

export default memo<PropsType>(Uploader);
