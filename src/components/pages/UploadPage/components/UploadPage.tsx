import React, { FormEvent, useContext } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import { AnyAction } from '@reduxjs/toolkit';
import { AxiosProgressEvent } from 'axios';
import { ConfigContext, ToastContext } from '../../../../context';
import { fileValidation, formatFileSize, isArrayEmpty, isObjectEmpty } from '../../../../common';
import { LinearProgressWithLabel } from '../../../LinearProgressWithLabel';
import { Form } from '../../../Form';
import { FormNotes } from '../../../Form/components/FormNotes';
import { FormNote } from '../../../Form/components/FormNote';
import { FormField } from '../../../Form/components/FormField';
import { FormFields } from '../../../Form/components/FormFields';
import { FormControls } from '../../../Form/components/FormControls';
import { FormFile } from '../../../Form/components/FormFile';
import useDidUpdate from '../../../../hooks/useDidUpdate';
import useWebSocket from '../../../../hooks/useWebSocket';
import useSetState from '../../../../hooks/useSetState';
import {
    uploadError,
    uploadProgress,
    uploadStart,
    uploadSuccess,
    uploadReset,
} from '../../../../state/reducers/uploader';
import { loadVideosSuccess } from '../../../../state/reducers/loadVideos';
import { useAppDispatch, useAppSelector } from '../../../../state/hooks';
import { LoadedVideoType } from '../../../../state/types';
import { ConvertFileStepType, ConvertProgressStepType, CreateStepType } from '../../../../server/types';
import { DependenciesType, StateType } from '../types';
import submitUploadForm from '../api/submitUploadForm';
import '../styles/upload-page.scss';

export const DEFAULT_STATE: StateType = {
    selectedFiles: null,
    loaded: 0,
    uploading: false,
    uploadedFiles: [],
    validation: null,
};

const UploadPage = () => {
    const config = useContext(ConfigContext);
    const toast = useContext(ToastContext);
    const dispatch = useAppDispatch();
    const { error, result } = useAppSelector(({ uploaderReducer }) => uploaderReducer);
    const maxFiles = config.videoUpload.maxFiles;
    const maxFileSize = config.videoUpload.maxFileSize;
    const maxTotalFileSize = config.videoUpload.maxTotalFileSize;
    const allowedFileExtensions = config.allowedFileExtensions;
    const [state, setState] = useSetState(UploadPage.DEFAULT_STATE);
    const formUrl = config.endpoints.api.video.upload;

    const dispatchAndWait = (action: AnyAction) => new Promise(resolve => {
        dispatch(action);
        setTimeout(resolve);
    });
    const onCreateStep = (params: CreateStepType) => {
        const { step, total, status } = params;
        /* step: 3,
        total: 3,
        status: 'Parsing' */
        // console.log('---> onUploadStep', params);

        // if (step === total) {
        //     this.setState({ uploadedFiles: [] });
        // }
    };
    const onConvertStepFile = (params: ConvertFileStepType) => {
        const { index } = params;

        state.uploadedFiles[index] = params;
        setState({ uploadedFiles: state.uploadedFiles });
    };
    const onConvertStepFileProgress = (params: ConvertProgressStepType) => {
        const { index } = params;

        state.uploadedFiles[index] = params;
        setState({ uploadedFiles: state.uploadedFiles });
        // console.log('upload.step.file.progress', params);
    };
    const onUploadProgress = ({ event: { lengthComputable }, loaded: progressLoaded, total }: AxiosProgressEvent) => {
        if (lengthComputable && typeof total === 'number') {
            const percentage = (progressLoaded / total) * 100;

            dispatch(uploadProgress(percentage));
            setState({ loaded: percentage });
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
        setState({ validation: UploadPage.DEFAULT_STATE.validation });

        if (!validationResult.success) {
            setState({ validation: validationResult });
            return [];
        }

        return files;
    };
    const onFileChange = async (files: Nullable<File[]>) => {
        // const files = Array.from((event.target as HTMLInputElement).files as FileList);

        if (isArrayEmpty(files)) {
            // User opened dialog, then clicked cancel
            setState({
                loaded: UploadPage.DEFAULT_STATE.loaded,
                selectedFiles: UploadPage.DEFAULT_STATE.selectedFiles,
                uploading: UploadPage.DEFAULT_STATE.uploading,
                uploadedFiles: UploadPage.DEFAULT_STATE.uploadedFiles,
            });
            return;
        }

        setState({
            loaded: UploadPage.DEFAULT_STATE.loaded,
            selectedFiles: files,
            uploading: UploadPage.DEFAULT_STATE.uploading,
            uploadedFiles: [],
        });
    };
    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        const data = new FormData();

        event.preventDefault();
        await dispatchAndWait(uploadReset());
        setState({ validation: UploadPage.DEFAULT_STATE.validation });

        if (!state.selectedFiles) {
            dispatch(uploadError('Error: No files selected'));
            return;
        }

        state.selectedFiles.forEach(file => {
            data.append('file', file);
        });

        try {
            setState({ loaded: UploadPage.DEFAULT_STATE.loaded, uploading: true });
            dispatch(uploadStart(formUrl));

            const submissionResult = await submitUploadForm({
                url: formUrl,
                data,
                onProgress: onUploadProgress,
            });

            if (submissionResult.data.validation) {
                setState({ validation: submissionResult.data.validation });
            } else {
                dispatch(uploadSuccess(submissionResult.data));
            }
        } catch (err: unknown) {
            dispatch(uploadError((err as Error).message));
        } finally {
            setState({
                loaded: UploadPage.DEFAULT_STATE.loaded,
                // Uncomment below to auto reset after upload
                // selectedFiles: UploadPage.DEFAULT_STATE.selectedFiles,
                uploadedFiles: UploadPage.DEFAULT_STATE.uploadedFiles,
                uploading: UploadPage.DEFAULT_STATE.uploading,
            });
        }
    };
    const onWebSocketMessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data);
        // console.log('websocket message', message);

        switch (message.event) {
            case 'create.step':
                onCreateStep(message.data);
                break;
            case 'convert.step.file':
                onConvertStepFile(message.data);
                break;
            case 'convert.step.file.progress':
                onConvertStepFileProgress(message.data);
                break;
            default:
        }
    };
    const webSocket = useWebSocket({ onMessage: onWebSocketMessage });
    const renderProgress = () => {
        if (state.selectedFiles) {
            return (
                <LinearProgressWithLabel
                    className="status-progress"
                    hideLabelWhenEmpty
                    variant="determinate"
                    value={ state.loaded }
                />
            );
        }

        return null;
    };
    const renderFiles = () => {
        if (!state.selectedFiles) {
            return <span>No files selected</span>;
        }

        return (
            <ul className="files">
                {state.selectedFiles.map((item, index) => {
                    const uploadItem = state.uploadedFiles[index];
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
                                <LinearProgressWithLabel
                                    hideLabelWhenEmpty
                                    variant="determinate"
                                    value={ (uploadItem as ConvertProgressStepType)?.percent ?? 0 }
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
        const { validation } = state;

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
    }, [error, result, state.validation]);

    const submitButtonAttributes: MuiButtonProps<'button', { component: 'button' }> = {
        variant: 'contained',
        component: 'button',
        type: 'submit',
    };
    const files = renderFiles();
    const progressElement = renderProgress();

    if (!state.selectedFiles || state.uploading) {
        submitButtonAttributes.disabled = true;
    }

    return (
        <div className="page-upload">
            <h2>Upload Videos</h2>

            <section className="content">
                <Form
                    className="form-upload"
                    method="POST"
                    action={ formUrl }
                    onSubmit={ onSubmit }
                >
                    <FormNotes>
                        <FormNote>
                            Your videos will be converted to mp4 format.
                            Thumbnail and animated thumbnail images will also be generated.
                        </FormNote>
                    </FormNotes>
                    <FormFields>
                        <FormField>
                            <FormFile
                                allowedFileExtensions={ allowedFileExtensions }
                                enabled={ !state.uploading }
                                maxFiles={ maxFiles }
                                maxFileSize={ maxFileSize }
                                maxTotalFileSize={ maxTotalFileSize }
                                multiple
                                name="file"
                                // useDragAndDrop={ false }
                                onChange={ onFileChange }
                                onValidate={ onFileValidate }
                            />
                        </FormField>
                        <div className="form-files">
                            {files}
                        </div>
                    </FormFields>
                    {progressElement && (
                        <div className="form-progress">
                            {progressElement}
                        </div>
                    )}
                    <FormControls>
                        <Button { ...submitButtonAttributes }>
                            Upload
                            <CloudUploadIcon className="button-icon-right" />
                        </Button>
                    </FormControls>
                </Form>
            </section>
        </div>
    );
};

UploadPage.displayName = 'UploadPage';

UploadPage.DEFAULT_STATE = DEFAULT_STATE;

export default UploadPage;
