import React, { FormEvent, useContext, useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import { AnyAction } from '@reduxjs/toolkit';
import { AxiosProgressEvent } from 'axios';
import { ConfigContext, ToastContext } from '../../../../context';
import { fileValidation, formatFileSize, isArrayEmpty, isObjectEmpty } from '../../../../common';
import { Form } from '../../../Form';
import { FormField } from '../../../Form/components/FormField';
import { FormFields } from '../../../Form/components/FormFields';
import { FormControls } from '../../../Form/components/FormControls';
import { FormFile } from '../../../Form/components/FormFile';
import InfoTable from '../../../InfoTable';
import useDidUpdate from '../../../../hooks/useDidUpdate';
import useWebSocket from '../../../../hooks/useWebSocket';
import {
    uploadError,
    uploadProgress,
    uploadStart,
    uploadSuccess,
    uploadValidationErrors,
    uploadReset,
} from '../../../../state/reducers/uploader';
import { loadVideosSuccess } from '../../../../state/reducers/loadVideos';
import { useAppDispatch, useAppSelector } from '../../../../state/hooks';
import { LoadedVideoType } from '../../../../state/types';
import { DependenciesType, StateType } from '../types';
import { UploadFileStepType, UploadProgressStepType, UploadStepType } from '../../../../server/types';
import submitUploadForm from '../api/submitUploadForm';
import '../styles/upload-page.scss';

export const DEFAULT_STATE: StateType = {
    selectedFiles: null,
    loaded: 0,
    uploading: false,
    uploadedFiles: [],
};

const UploadPage = () => {
    const config = useContext(ConfigContext);
    const toast = useContext(ToastContext);
    const dispatch = useAppDispatch();
    // const { uploadError, uploadResult, uploadValidation } = useAppSelector(({ uploaderReducer }) => uploaderReducer);
    const { error, result, validation } = useAppSelector(({ uploaderReducer }) => uploaderReducer);
    const maxFiles = config.videoUpload.maxFiles;
    const maxFileSize = config.videoUpload.maxFileSize;
    const maxTotalFileSize = config.videoUpload.maxTotalFileSize;
    const allowedFileExtensions = config.allowedFileExtensions;
    const formattedMaxFileSize = formatFileSize(maxFileSize);
    const formattedMaxTotalFileSize = formatFileSize(maxTotalFileSize);
    const [loaded, setLoaded] = useState(UploadPage.DEFAULT_STATE.loaded);
    const [selectedFiles, setSelectedFiles] = useState(UploadPage.DEFAULT_STATE.selectedFiles);
    const [uploading, setUploading] = useState(UploadPage.DEFAULT_STATE.uploading);
    const [uploadedFiles, setUploadedFiles] = useState(UploadPage.DEFAULT_STATE.uploadedFiles);
    const formUrl = config.endpoints.api.video.upload;

    const dispatchAndWait = (action: AnyAction) => new Promise(resolve => {
        dispatch(action);
        setTimeout(resolve);
    });
    const generateInfo = () => ([
        { title: 'Allowed file types:', text: allowedFileExtensions.join(', ') },
        { title: 'Maximum file size:', text: formattedMaxFileSize },
        { title: 'Maximum files:', text: maxFiles },
        { title: 'Maximum files size:', text: formattedMaxTotalFileSize },
    ]);
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
    const onUploadProgress = ({ event: { lengthComputable }, loaded: progressLoaded, total }: AxiosProgressEvent) => {
        if (lengthComputable && typeof total === 'number') {
            const percentage = (progressLoaded / total) * 100;

            dispatch(uploadProgress(percentage));
            setLoaded(percentage);
        }
    };
    const onFileValidate = async (files: File[]): Promise<File[]> => {
        const validationResult = await fileValidation({
            files,
            allowedFileExtensions,
            maxFiles,
            maxFileSize,
            maxTotalFileSize,
        });

        await dispatchAndWait(uploadReset());

        if (!validationResult.success) {
            dispatch(uploadValidationErrors(validationResult));
            return [];
        }

        return files;
    };
    const onFileChange = async (files: Nullable<File[]>) => {
        // const files = Array.from((event.target as HTMLInputElement).files as FileList);

        if (isArrayEmpty(files)) {
            // User opened dialog, then clicked cancel
            setLoaded(UploadPage.DEFAULT_STATE.loaded);
            setSelectedFiles(UploadPage.DEFAULT_STATE.selectedFiles);
            setUploading(UploadPage.DEFAULT_STATE.uploading);
            setUploadedFiles(UploadPage.DEFAULT_STATE.uploadedFiles);
            return;
        }

        // await dispatchAndWait(uploadReset());
        //
        // const validationResult = await fileValidation({
        //     files: files as File[],
        //     allowedFileExtensions,
        //     maxFiles,
        //     maxFileSize,
        //     maxTotalFileSize,
        // });
        //
        // if (!validationResult.success) {
        //     // eslint-disable-next-line no-param-reassign
        //     // event.target.value = '';
        //     dispatch(uploadValidationErrors(validationResult));
        // } else {
        //     setSelectedFiles(files);
        //     setUploadedFiles([]);
        // }

        setSelectedFiles(files);
        setUploadedFiles([]);

        setLoaded(UploadPage.DEFAULT_STATE.loaded);
        setUploading(UploadPage.DEFAULT_STATE.uploading);
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
            setLoaded(UploadPage.DEFAULT_STATE.loaded);
            setUploading(true);
            dispatch(uploadStart(formUrl));

            const submissionResult = await submitUploadForm({
                url: formUrl,
                data,
                onProgress: onUploadProgress,
            });

            if (submissionResult.data.validation) {
                dispatch(uploadValidationErrors(submissionResult.data.validation));
            } else {
                dispatch(uploadSuccess(submissionResult.data));
            }
        } catch (err: unknown) {
            dispatch(uploadError((err as Error).message));
        } finally {
            setLoaded(UploadPage.DEFAULT_STATE.loaded);
            setUploadedFiles(UploadPage.DEFAULT_STATE.uploadedFiles);
            setUploading(UploadPage.DEFAULT_STATE.uploading);
            // Uncomment below to auto reset after upload
            // setSelectedFiles(UploadPage.DEFAULT_STATE.selectedFiles);
        }
    };
    const onWebSocketMessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data);
        // console.log('websocket message', message);

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
    const webSocket = useWebSocket({ onMessage: onWebSocketMessage });
    const renderProgress = () => {
        if (selectedFiles) {
            return <LinearProgress className="status-progress" variant="determinate" value={ loaded } />;
        }

        return null;
    };
    const renderFiles = () => {
        if (!selectedFiles) {
            return <span>No files selected</span>;
        }

        return (
            <ul className="files">
                {selectedFiles.map((item, index) => {
                    const uploadItem = uploadedFiles[index];
                    const s = uploadItem?.status && uploadItem.step !== uploadItem.total ?
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

    useDidUpdate<DependenciesType>(prevProps => {
        const errorMessages: string[] = [];

        if (!isObjectEmpty(validation) && !validation?.success) {
            validation?.overallErrors?.forEach((err: string) => errorMessages.push(err));

            if (!isObjectEmpty(validation?.fileErrors) &&
                prevProps?.validation?.fileErrors !== validation?.fileErrors) {
                Object
                    .values(validation?.fileErrors as Record<number, string[]>)
                    .forEach(values => {
                        values.forEach(value => errorMessages.push(value));
                    })
                ;
            }
        }

        if (error && !prevProps.error) {
            errorMessages.push(error);
        }

        if (!isArrayEmpty(errorMessages)) {
            toast.error(errorMessages.join('\n'));
        } else if (result && !prevProps.result) {
            toast.success('Upload complete');

            dispatch(loadVideosSuccess(result.items as LoadedVideoType[]));
        }
    }, [error, result, validation]);

    const submitButtonAttributes: MuiButtonProps<'button', { component: 'button' }> = {
        variant: 'contained',
        component: 'button',
        type: 'submit',
    };
    const files = renderFiles();
    const progressElement = renderProgress();

    if (!selectedFiles || uploading) {
        submitButtonAttributes.disabled = true;
    }

    return (
        <div className="page-upload">
            <h2>Upload Videos</h2>

            <section className="content">
                <InfoTable items={ generateInfo() } />
                <Form
                    className="form-upload"
                    method="POST"
                    action={ formUrl }
                    onSubmit={ onSubmit }
                >
                    <FormFields>
                        <FormField>
                            <FormFile
                                allowedFileExtensions={ allowedFileExtensions }
                                enabled={ !uploading }
                                multiple
                                name="file"
                                onChange={ onFileChange }
                                onValidate={ onFileValidate }
                            />
                        </FormField>
                    </FormFields>
                    <FormControls>
                        <Button { ...submitButtonAttributes }>
                            Upload
                            <CloudUploadIcon className="button-icon-right" />
                        </Button>
                    </FormControls>
                </Form>

                <div className="status">
                    <div className="status-files">{files}</div>
                    {progressElement}
                </div>
            </section>
        </div>
    );
};

UploadPage.displayName = 'UploadPage';

UploadPage.DEFAULT_STATE = DEFAULT_STATE;

export default UploadPage;
