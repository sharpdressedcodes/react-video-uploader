import React, { FormEvent, ReactNode, useCallback, useContext, useRef } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import { AnyAction } from '@reduxjs/toolkit';
import { AxiosProgressEvent } from 'axios';
import { ConfigContext, ToastContext } from '../../../../context';
import {
    formatFileSize,
    isArrayEmpty,
    isObjectEmpty,
} from '../../../../common';
import {
    videoFileExtensions as allowedFileExtensions,
} from '../../../../config/fileTypes';
import validateFormFile from '../../../../common/validation/validateFormFile';
import LinearProgressWithLabel from '../../../LinearProgressWithLabel';
import Form, { BaseFormMessageType, BaseFormMessageDataType } from '../../../Form';
import { defaultBaseFormWithProgressState } from '../../../Form/types';
import FormNotes from '../../../Form/components/FormNotes';
import FormNote from '../../../Form/components/FormNote';
import FormFields from '../../../Form/components/FormFields';
import FormControls from '../../../Form/components/FormControls';
import FormFile from '../../../Form/components/FormFile';
import FormAlerts from '../../../Form/components/FormAlerts';
import FormAlert from '../../../Form/components/FormAlert';
import FileAlerts from '../../../Form/components/FormFile/components/FileAlerts';
import { AlertMessageType } from '../../../Form/components/FormField/components/FormFieldAlerts';
import useDidUpdate from '../../../../hooks/useDidUpdate';
import useWebSocket from '../../../../hooks/useWebSocket';
import useSetState from '../../../../hooks/useSetState';
import {
    uploadError,
    uploadProgress,
    uploadReset,
    uploadStart,
    uploadSuccess,
} from '../../../../state/reducers/uploader';
import { loadVideosSuccess } from '../../../../state/reducers/loadVideos';
import { useAppDispatch, useAppSelector } from '../../../../state/hooks';
import { LoadedVideoType } from '../../../../state/types';
import { ConvertFileStepType, ConvertProgressStepType/* , CreateStepType */ } from '../../../../server/types';
import { FormStateType, SelectedFileType, StateType } from '../types';
import submitUploadForm from '../api/submitUploadForm';
import componentConfig from '../config';
import '../styles/upload-page.scss';

export const DEFAULT_FORM_STATE: FormStateType = {
    ...defaultBaseFormWithProgressState,
    videos: [],
    // errorMessages: {
    //     videos: ['Error'],
    // },
    // warningMessages: {
    //     videos: ['Test warning'],
    // },
    // infoMessages: {
    //     videos: ['Test info'],
    // },
    // successMessages: {
    //     videos: ['Test success'],
    // },
};

export const DEFAULT_STATE: StateType = {
    files: null,
};

const UploadPage = () => {
    const config = useContext(ConfigContext);
    const toast = useContext(ToastContext);
    const dispatch = useAppDispatch();
    const { error: uploadStateError, result: uploadStateResult } = useAppSelector(({ uploaderReducer }) => uploaderReducer);
    const formUrl = config.endpoints.api.video.upload;
    const [state, setState] = useSetState(UploadPage.DEFAULT_STATE);
    const [formState, setFormState] = useSetState(DEFAULT_FORM_STATE);
    const refs = {
        videos: useRef<Nullable<HTMLInputElement>>(null),
    };

    const validateVideos = (): Record<string, string[]> => validateFormFile(formState.videos, componentConfig.videos.rules!);
    const validateForm = (): BaseFormMessageType => ({
        videos: validateVideos(),
    });
    const isFormValid = () => {
        const { videos } = validateForm();
        const checks = [
            isObjectEmpty(videos),
        ];

        return checks.filter(Boolean).length === checks.length;
    };
    const syncFileState = (validationResult: BaseFormMessageDataType) => {
        const newState: Partial<StateType> = {
            files: state.files,
        };

        Object.entries((validationResult as Record<string, string[]>)).forEach(([key, value]) => {
            const numericKey = parseInt(key, 10);
            const isNumeric = !Number.isNaN(numericKey);

            if (isNumeric && newState?.files) {
                newState.files[numericKey].alerts = value.map(v => ({ severity: 'error', message: v }));
            }
        });

        setState(newState);
    };
    const dispatchAndWait = (action: AnyAction) => new Promise(resolve => {
        dispatch(action);
        setTimeout(resolve);
    });
    const focusOnFirstError = (hasFileErrors: boolean) => {
        if (hasFileErrors) {
            refs.videos?.current?.focus();
        }
    };
    const getMessages = (record: Nullable<BaseFormMessageType>): BaseFormMessageType => {
        if (!record) {
            return { videos: {}, form: [] };
        }

        return {
            videos: record?.videos ?? {},
            form: record?.form ?? [],
        };
    };
    const buildFieldAlerts = (id: string) => {
        const isObject = ['videos'].includes(id);
        const {
            [id]: errorMessages = isObject ? {} : [],
        } = getMessages(formState?.errorMessages);
        const {
            [id]: infoMessages = isObject ? {} : [],
        } = getMessages(formState?.infoMessages);
        const {
            [id]: successMessages = isObject ? {} : [],
        } = getMessages(formState?.successMessages);
        const {
            [id]: warningMessages = isObject ? {} : [],
        } = getMessages(formState?.warningMessages);

        const array: AlertMessageType[] = [
            ...((isObject ? Object.values(errorMessages) : errorMessages) as string[]).map(
                msg => ({ severity: 'error', message: msg } as AlertMessageType),
            ),
            ...((isObject ? Object.values(warningMessages) : warningMessages) as string[]).map(
                msg => ({ severity: 'warning', message: msg } as AlertMessageType),
            ),
            ...((isObject ? Object.values(infoMessages) : infoMessages) as string[]).map(
                msg => ({ severity: 'info', message: msg } as AlertMessageType),
            ),
            ...((isObject ? Object.values(successMessages) : successMessages) as string[]).map(
                msg => ({ severity: 'success', message: msg } as AlertMessageType),
            ),
        ];

        return isArrayEmpty(array) ? null : array;
    };
    // const onCreateStep = (params: CreateStepType) => {
    //     // const { step, total, status } = params;
    //
    //     // console.log('onCreateStep', params);
    // };
    const onConvertStepFile = (params: ConvertFileStepType) => {
        const { index } = params;

        // console.log('onConvertStepFile', params, state?.files);

        (state?.files as SelectedFileType[])[index].convertStep = params;
        setState(state);
    };
    const onConvertStepFileProgress = (params: ConvertProgressStepType) => {
        const { index } = params;

        // console.log('onConvertStepFileProgress', params, state?.files);

        (state?.files as SelectedFileType[])[index].convertProgress = params;
        setState(state);
    };
    const onUploadProgress = ({ event: { lengthComputable }, loaded: progressLoaded, total }: AxiosProgressEvent) => {
        if (lengthComputable && typeof total === 'number') {
            const percentage = (progressLoaded / total) * 100;

            dispatch(uploadProgress(percentage));
            setFormState({ progressPercentage: percentage });
        }
    };
    const onVideosChange = async (videos: Nullable<File[]>) => {
        // User opened dialog, then clicked cancel.
        if (!videos || isArrayEmpty(videos)) {
            setState({ files: UploadPage.DEFAULT_STATE.files });
            setFormState({ videos: UploadPage.DEFAULT_FORM_STATE.videos });
            return;
        }

        setState({ files: videos.map(file => ({
            file,
            alerts: null,
            convertStep: null,
            convertProgress: null,
        }) as SelectedFileType) });
        setFormState({
            videos,
            errorMessages: {
                ...formState.errorMessages,
                videos: {},
            },
        });
    };
    const onVideosChanged = () => {
        // Treat this field a little differently than the others.
        // Perform validation on change, but only show the
        // 'required' message if the form has actually been submitted.
        const videosErrors = validateVideos();
        const newFormState: Partial<FormStateType> = {};

        if (!formState.hasSubmit && isArrayEmpty(formState.videos)) {
            newFormState.errorMessages = {
                ...formState.errorMessages,
                videos: {},
            };

            setFormState(newFormState);
            syncFileState({});
            return;
        }

        newFormState.errorMessages = {
            ...formState.errorMessages,
            videos: videosErrors,
        };

        setFormState(newFormState);

        if (!isObjectEmpty(videosErrors)) {
            syncFileState(videosErrors);
        }
    };
    const onUploadResultChanged = (prevProps: { uploadStateResult: LoadedVideoType }) => {
        if (uploadStateResult && !prevProps.uploadStateResult) {
            dispatch(loadVideosSuccess(uploadStateResult.items as LoadedVideoType[]));
        }
    };
    const onUploadErrorChanged = (prevProps: { uploadStateError: string }) => {
        if (uploadStateError && !prevProps.uploadStateError) {
            toast.error(uploadStateError);
        }
    };
    const onUploadFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await dispatchAndWait(uploadReset());

        const validationResult = validateForm();

        setFormState({
            hasSubmit: true,
            isSubmitting: true,
            errorMessages: validationResult,
        });

        const hasVideosValidationErrors = !isObjectEmpty(validationResult.videos);

        if (hasVideosValidationErrors) {
            // if (hasVideosValidationErrors) {
            syncFileState(validationResult.videos);
            // }

            focusOnFirstError(hasVideosValidationErrors);
            setFormState({ isSubmitting: false });
            return;
        }

        const data = new FormData();

        state.files?.forEach(file => {
            if (!file.alerts || isArrayEmpty(file.alerts)) {
                data.append(componentConfig.videos.id, file.file);
            }
        });

        try {
            dispatch(uploadStart(formUrl));

            const submissionResult = await submitUploadForm({
                url: formUrl,
                data,
                onProgress: onUploadProgress,
            });

            if (submissionResult.data.errors) {
                setFormState({
                    errorMessages: submissionResult.data.errors,
                    isSubmitting: false,
                });

                if (!isObjectEmpty(submissionResult.data.errors.videos)) {
                    syncFileState(submissionResult.data.errors.videos);
                }
            } else {
                dispatch(uploadSuccess(submissionResult.data));
                // dispatch(loadVideosSuccess(submissionResult.data.items as LoadedVideoType[]));
                toast.success('Upload complete');
            }
        } catch (err: unknown) {
            dispatch(uploadError((err as Error).message));
        }

        // Uncomment below to auto reset after upload
        // setState({ files: UploadPage.DEFAULT_STATE.files });
        setFormState({
            progressPercentage: UploadPage.DEFAULT_FORM_STATE.progressPercentage,
            isSubmitting: UploadPage.DEFAULT_FORM_STATE.isSubmitting,
        });
    };
    const onWebSocketMessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data);

        // console.log('websocket message', message, state);

        switch (message.event) {
            case 'create.step':
                // onCreateStep(message.data);
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
    const renderProgress = () => {
        if (formState.videos) {
            return (
                <LinearProgressWithLabel
                    className="status-progress"
                    hideLabelWhenEmpty
                    variant="determinate"
                    value={ formState.progressPercentage }
                />
            );
        }

        return null;
    };
    const renderFiles = () => {
        if (!state.files) {
            return <span>No files selected</span>;
        }

        return (
            <ul className="files">
                {state.files.map((item, index) => {
                    let status: string | ReactNode = 'Ready to upload';
                    let progressValue = (item.convertProgress as ConvertProgressStepType)?.percent ?? 0;

                    if (item.convertStep && item.convertStep?.status) {
                        if (item.convertStep.step !== item.convertStep.total) {
                            status = `Step ${item.convertStep.step} of ${item.convertStep.total} - ${item.convertStep.status}`;
                        } else {
                            progressValue = 0;
                        }
                    }

                    if (item.alerts) {
                        status = <FileAlerts alerts={ item.alerts } />;
                        progressValue = 0;
                    }

                    return (
                        <li key={ item.file.name } className="file">
                            <span className="file-index">{index + 1}.</span>
                            <span className="file-name">{item.file.name}</span>
                            <span className="file-size">{formatFileSize(item.file.size)}</span>
                            <span className="file-status">{status}</span>
                            <span className="file-progress">
                                <LinearProgressWithLabel
                                    hideLabelWhenEmpty
                                    variant="determinate"
                                    value={ progressValue }
                                />
                            </span>
                        </li>
                    );
                })}
            </ul>
        );
    };
    const renderFormNotes = () => (
        <FormNotes>
            <FormNote>
                Required fields are marked with <span className="form-required">*</span>
            </FormNote>
        </FormNotes>
    );
    const renderFormAlerts = () => {
        const {
            videos: videosErrorMessages = {},
            form: formErrorMessages = [],
        } = getMessages(formState?.errorMessages);
        const {
            videos: videosWarningMessages = {},
            form: formWarningMessages = [],
        } = getMessages(formState?.warningMessages);
        const {
            videos: videosInfoMessages = {},
            form: formInfoMessages = [],
        } = getMessages(formState?.infoMessages);
        const {
            videos: videosSuccessMessages = {},
            form: formSuccessMessages = [],
        } = getMessages(formState?.successMessages);
        const mapComponentMessages = (
            messages: BaseFormMessageDataType,
            componentId: string,
            componentLabel: string,
        ) => (!Array.isArray(messages) ? Object.values(messages) : messages).map(item => (
            <FormAlert key={ `${componentId}-${item}` }>
                <label htmlFor={ componentId } title={ `Go to ${componentLabel}` }>
                    {item}
                </label>
            </FormAlert>
        ));
        const mapFormMessages = (array: string[]) => array.map(item => (
            <FormAlert key={ `form-${item}` }>
                {item}
            </FormAlert>
        ));

        return (
            <FormAlerts
                errorMessages={ [
                    ...mapComponentMessages(
                        videosErrorMessages,
                        componentConfig.videos.id,
                        componentConfig.videos.label,
                    ),
                    ...mapFormMessages(formErrorMessages as string[]),
                ] }
                warningMessages={ [
                    ...mapComponentMessages(
                        videosWarningMessages,
                        componentConfig.videos.id,
                        componentConfig.videos.label,
                    ),
                    ...mapFormMessages(formWarningMessages as string[]),
                ] }
                infoMessages={ [
                    ...mapComponentMessages(
                        videosInfoMessages,
                        componentConfig.videos.id,
                        componentConfig.videos.label,
                    ),
                    ...mapFormMessages(formInfoMessages as string[]),
                ] }
                successMessages={ [
                    ...mapComponentMessages(
                        videosSuccessMessages,
                        componentConfig.videos.id,
                        componentConfig.videos.label,
                    ),
                    ...mapFormMessages(formSuccessMessages as string[]),
                ] }
            />
        );
    };
    const render = () => {
        const submitButtonAttributes: MuiButtonProps<'button', { component: 'button' }> = {
            variant: 'contained',
            component: 'button',
            type: 'submit',
        };
        const files = renderFiles();
        const progressElement = renderProgress();
        const hasError = !isObjectEmpty(formState.errorMessages) &&
            !isObjectEmpty(formState.errorMessages?.videos)
        ;

        if (!isFormValid() || hasError || formState.isSubmitting) {
            submitButtonAttributes.disabled = true;
        }

        return (
            <div className="page-upload">
                <h2>Upload Videos</h2>

                <section className="content">
                    <Form
                        action={ formUrl }
                        className="form-upload"
                        encType="multipart/form-data"
                        method="POST"
                        onSubmit={ onUploadFormSubmit }
                    >
                        {renderFormNotes()}
                        {renderFormAlerts()}

                        <FormFields>
                            <FormFile
                                alertMessages={ buildFieldAlerts(componentConfig.videos.id) }
                                allowedFileExtensions={ allowedFileExtensions }
                                componentRef={ refs.videos }
                                disabled={ formState.isSubmitting }
                                helpMessage={ componentConfig.videos.helpMessage }
                                id={ componentConfig.videos.id }
                                label={ componentConfig.videos.label }
                                maxFiles={ componentConfig.videos.rules!.maxArrayLength.value }
                                maxFileSize={ componentConfig.videos.rules!.maxFileSize.value }
                                maxTotalFileSize={ componentConfig.videos.rules!.maxTotalFileSize.value }
                                required={ Boolean(componentConfig.videos.rules!.required) }
                                // useDragAndDrop={ false }
                                onChange={ onVideosChange }
                            />
                        </FormFields>
                        <div className="form-files">
                            {files}
                        </div>
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

    useDidUpdate(onVideosChanged, [formState.videos]);
    useDidUpdate(onUploadErrorChanged, [uploadStateError]);
    useDidUpdate(onUploadResultChanged, [uploadStateResult]);

    useWebSocket({
        onMessage: useCallback(onWebSocketMessage, [state.files]),
    });

    return render();
};

UploadPage.displayName = 'UploadPage';

UploadPage.DEFAULT_STATE = DEFAULT_STATE;

UploadPage.DEFAULT_FORM_STATE = DEFAULT_FORM_STATE;

export default UploadPage;
