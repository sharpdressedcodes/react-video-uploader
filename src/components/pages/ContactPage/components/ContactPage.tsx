import React, { FormEvent, ReactNode, useContext, useRef } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import Button, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import { AxiosProgressEvent } from 'axios';
import { ConfigContext, ToastContext } from '../../../../context';
import { formatFileSize, isArrayEmpty, isObjectEmpty } from '../../../../common';
import { maxEmailLength } from '../../../../common/validation/validateEmail';
import validateFormFile from '../../../../common/validation/validateFormFile';
import validateFormInput from '../../../../common/validation/validateFormInput';
import LinearProgressWithLabel from '../../../LinearProgressWithLabel';
import Form, { BaseFormMessageType, BaseFormMessageDataType } from '../../../Form';
import { defaultBaseFormWithProgressState } from '../../../Form/types';
import FormNotes from '../../../Form/components/FormNotes';
import FormNote from '../../../Form/components/FormNote';
import FormFields from '../../../Form/components/FormFields';
import FormControls from '../../../Form/components/FormControls';
import FormFile from '../../../Form/components/FormFile';
import FormInput from '../../../Form/components/FormInput';
import FormAlerts from '../../../Form/components/FormAlerts';
import FormAlert from '../../../Form/components/FormAlert';
import FileAlerts from '../../../Form/components/FormFile/components/FileAlerts';
import { AlertMessageType } from '../../../Form/components/FormField/components/FormFieldAlerts';
import useDidUpdate from '../../../../hooks/useDidUpdate';
import useSetState from '../../../../hooks/useSetState';
import { FormStateType, SelectedFileType, StateType } from '../types';
import submitContactForm from '../api/submitContactForm';
import componentConfig from '../config';
import '../styles/contact-page.scss';

export const DEFAULT_FORM_STATE: FormStateType = {
    ...defaultBaseFormWithProgressState,
    email: '',
    message: '',
    files: [],
    // errorMessages: {
    //     email: ['Error'],
    //     message: ['Error'],
    //     files: ['Error'],
    // },
    // warningMessages: {
    //     email: ['Test warning'],
    // },
    // infoMessages: {
    //     message: ['Test info'],
    // },
    // successMessages: {
    //     message: ['Test success'],
    // },
};

export const DEFAULT_STATE: StateType = {
    files: null,
};

const ContactPage = () => {
    const config = useContext(ConfigContext);
    const toast = useContext(ToastContext);
    const formUrl = config.endpoints.api.contact.submit;
    const [state, setState] = useSetState(ContactPage.DEFAULT_STATE);
    const [formState, setFormState] = useSetState(DEFAULT_FORM_STATE);
    const refs = {
        email: useRef<Nullable<HTMLInputElement>>(null),
        message: useRef<Nullable<HTMLInputElement>>(null),
        files: useRef<Nullable<HTMLInputElement>>(null),
    };

    const validateEmail = (): string[] => validateFormInput(formState.email, componentConfig.email.rules!);
    const validateMessage = (): string[] => validateFormInput(formState.message, componentConfig.message.rules!);
    const validateFiles = (): Record<string, string[]> => validateFormFile(formState.files, componentConfig.files.rules!);
    const validateForm = (): BaseFormMessageType => ({
        email: validateEmail(),
        message: validateMessage(),
        files: validateFiles(),
    });
    const isFormValid = () => {
        const { email, message, files } = validateForm();
        const checks = [
            isArrayEmpty(email),
            isArrayEmpty(message),
            isObjectEmpty(files),
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
    const focusOnFirstError = (hasEmailErrors: boolean, hasMessageErrors: boolean, hasFileErrors: boolean) => {
        if (hasEmailErrors) {
            refs.email?.current?.focus();
            return;
        }

        if (hasMessageErrors) {
            refs.message?.current?.focus();
            return;
        }

        if (hasFileErrors) {
            refs.files?.current?.focus();
        }
    };
    const getMessages = (record: Nullable<BaseFormMessageType>): BaseFormMessageType => {
        if (!record) {
            return { email: [], message: [], files: {}, form: [] };
        }

        return {
            email: record?.email ?? [],
            message: record?.message ?? [],
            files: record?.files ?? {},
            form: record?.form ?? [],
        };
    };
    const buildFieldAlerts = (id: string) => {
        const isObject = ['files'].includes(id);
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
    const onUploadProgress = ({ event: { lengthComputable }, loaded: progressLoaded, total }: AxiosProgressEvent) => {
        if (lengthComputable && typeof total === 'number') {
            const percentage = (progressLoaded / total) * 100;

            setFormState({ progressPercentage: percentage });
        }
    };
    const onEmailChange = (value: string) => {
        setFormState({ email: value });
    };
    const onEmailChanged = () => {
        if (formState.hasSubmit) {
            const emailErrors = validateEmail();
            const newState = {
                errorMessages: {
                    ...formState.errorMessages,
                    email: emailErrors,
                },
            };

            setFormState(newState);
        }
    };
    const onMessageChange = (value: string) => {
        setFormState({ message: value });
    };
    const onMessageChanged = () => {
        if (formState.hasSubmit) {
            const messageErrors = validateMessage();
            const newState = {
                errorMessages: {
                    ...formState.errorMessages,
                    message: messageErrors,
                },
            };

            setFormState(newState);
        }
    };
    const onFilesChange = async (files: Nullable<File[]>) => {
        // User opened dialog, then clicked cancel.
        if (!files || isArrayEmpty(files)) {
            setState({ files: ContactPage.DEFAULT_STATE.files });
            setFormState({ files: ContactPage.DEFAULT_FORM_STATE.files });
            return;
        }

        setState({ files: (files as File[]).map(file => ({
            file,
            alerts: null,
        }) as SelectedFileType) });
        setFormState({
            files: files as File[],
            errorMessages: {
                ...formState.errorMessages,
                files: {},
            },
        });
    };
    const onFilesChanged = () => {
        // Treat this field a little differently than the others.
        // Perform validation on change, but only show the
        // 'required' message if the form has actually been submitted.
        const fileErrors = validateFiles();
        const newFormState: Partial<FormStateType> = {};

        if (!formState.hasSubmit && isArrayEmpty(formState.files)) {
            newFormState.errorMessages = {
                ...formState.errorMessages,
                files: {},
            };

            setFormState(newFormState);
            syncFileState({});
            return;
        }

        newFormState.errorMessages = {
            ...formState.errorMessages,
            files: fileErrors,
        };

        setFormState(newFormState);

        if (!isObjectEmpty(fileErrors)) {
            syncFileState(fileErrors);
        }
    };
    const onContactFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationResult = validateForm();

        setFormState({
            hasSubmit: true,
            isSubmitting: true,
            errorMessages: validationResult,
        });

        const hasEmailValidationErrors = !isArrayEmpty(validationResult.email);
        const hasMessageValidationErrors = !isArrayEmpty(validationResult.message);
        const hasFileValidationErrors = !isObjectEmpty(validationResult.files);

        if (hasEmailValidationErrors ||
            hasMessageValidationErrors ||
            hasFileValidationErrors) {
            if (hasFileValidationErrors) {
                syncFileState(validationResult.file);
            }

            focusOnFirstError(hasEmailValidationErrors, hasMessageValidationErrors, hasFileValidationErrors);
            setFormState({ isSubmitting: false });
            return;
        }

        const data = new FormData();

        data.append(componentConfig.email.id, formState.email);
        data.append(componentConfig.message.id, formState.message);

        state.files?.forEach(file => {
            if (!file.alerts || isArrayEmpty(file.alerts)) {
                data.append(componentConfig.files.id, file.file);
            }
        });

        try {
            const submissionResult = await submitContactForm({
                url: formUrl,
                data,
                onProgress: onUploadProgress,
            });

            if (submissionResult.data.errors) {
                setFormState({
                    errorMessages: submissionResult.data.errors,
                    isSubmitting: false,
                });

                if (!isObjectEmpty(submissionResult.data.errors.file)) {
                    syncFileState(submissionResult.data.errors.file);
                }
            } else {
                toast.success('Message sent');
            }
        } catch (err: unknown) {
            toast.error((err as Error).message);
        }

        // Uncomment below to auto reset after upload
        // setState({ files: UploadPage.DEFAULT_STATE.files });
        setFormState({
            progressPercentage: ContactPage.DEFAULT_FORM_STATE.progressPercentage,
            isSubmitting: ContactPage.DEFAULT_FORM_STATE.isSubmitting,
        });
    };
    const renderProgress = () => {
        if (formState.files) {
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
                    // let progressValue = (item.convertProgress as ConvertProgressStepType)?.percent ?? 0;

                    // if (item.convertStep && item.convertStep?.status) {
                    //     if (item.convertStep.step !== item.convertStep.total) {
                    //         status = `Step ${item.convertStep.step} of ${item.convertStep.total} - ${item.convertStep.status}`;
                    //     } else {
                    //         progressValue = 0;
                    //     }
                    // }

                    if (item.alerts) {
                        status = <FileAlerts alerts={ item.alerts } />;
                        // progressValue = 0;
                    }

                    return (
                        <li key={ item.file.name } className="file">
                            <span className="file-index">{index + 1}.</span>
                            <span className="file-name">{item.file.name}</span>
                            <span className="file-size">{formatFileSize(item.file.size)}</span>
                            <span className="file-status">{status}</span>
                            {/* <span className="file-progress">
                                <LinearProgressWithLabel
                                    hideLabelWhenEmpty
                                    variant="determinate"
                                    value={ progressValue }
                                />
                            </span> */}
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
            email: emailErrorMessages = [],
            message: messageErrorMessages = [],
            files: fileErrorMessages = {},
            form: formErrorMessages = [],
        } = getMessages(formState?.errorMessages);
        const {
            email: emailWarningMessages = [],
            message: messageWarningMessages = [],
            files: fileWarningMessages = {},
            form: formWarningMessages = [],
        } = getMessages(formState?.warningMessages);
        const {
            email: emailInfoMessages = [],
            message: messageInfoMessages = [],
            files: fileInfoMessages = {},
            form: formInfoMessages = [],
        } = getMessages(formState?.infoMessages);
        const {
            email: emailSuccessMessages = [],
            message: messageSuccessMessages = [],
            files: fileSuccessMessages = {},
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
                        emailErrorMessages,
                        componentConfig.email.id,
                        componentConfig.email.label,
                    ),
                    ...mapComponentMessages(
                        messageErrorMessages,
                        componentConfig.message.id,
                        componentConfig.message.label,
                    ),
                    ...mapComponentMessages(
                        fileErrorMessages,
                        componentConfig.files.id,
                        componentConfig.files.label,
                    ),
                    ...mapFormMessages(formErrorMessages as string[]),
                ] }
                warningMessages={ [
                    ...mapComponentMessages(
                        emailWarningMessages,
                        componentConfig.email.id,
                        componentConfig.email.label,
                    ),
                    ...mapComponentMessages(
                        messageWarningMessages,
                        componentConfig.message.id,
                        componentConfig.message.label,
                    ),
                    ...mapComponentMessages(
                        fileWarningMessages,
                        componentConfig.files.id,
                        componentConfig.files.label,
                    ),
                    ...mapFormMessages(formWarningMessages as string[]),
                ] }
                infoMessages={ [
                    ...mapComponentMessages(
                        emailInfoMessages,
                        componentConfig.email.id,
                        componentConfig.email.label,
                    ),
                    ...mapComponentMessages(
                        messageInfoMessages,
                        componentConfig.message.id,
                        componentConfig.message.label,
                    ),
                    ...mapComponentMessages(
                        fileInfoMessages,
                        componentConfig.files.id,
                        componentConfig.files.label,
                    ),
                    ...mapFormMessages(formInfoMessages as string[]),
                ] }
                successMessages={ [
                    ...mapComponentMessages(
                        emailSuccessMessages,
                        componentConfig.email.id,
                        componentConfig.email.label,
                    ),
                    ...mapComponentMessages(
                        messageSuccessMessages,
                        componentConfig.message.id,
                        componentConfig.message.label,
                    ),
                    ...mapComponentMessages(
                        fileSuccessMessages,
                        componentConfig.files.id,
                        componentConfig.files.label,
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
            (!isObjectEmpty(formState.errorMessages?.email) ||
                !isObjectEmpty(formState.errorMessages?.message) ||
                !isObjectEmpty(formState.errorMessages?.files)
            )
        ;

        if (!isFormValid() || hasError || formState.isSubmitting) {
            submitButtonAttributes.disabled = true;
        }

        return (
            <div className="page-contact">
                <h2>Contact Us</h2>

                <section className="content">
                    <Form
                        action={ formUrl }
                        className="form-contact"
                        encType="multipart/form-data"
                        method="POST"
                        onSubmit={ onContactFormSubmit }
                    >
                        {renderFormNotes()}
                        {renderFormAlerts()}

                        <FormFields>
                            <FormInput
                                alertMessages={ buildFieldAlerts(componentConfig.email.id) }
                                autoComplete="email"
                                autoFocus
                                componentRef={ refs.email }
                                disabled={ formState.isSubmitting }
                                helpMessage={ componentConfig.email.helpMessage }
                                id={ componentConfig.email.id }
                                label={ componentConfig.email.label }
                                maxLength={ maxEmailLength }
                                required={ Boolean(componentConfig.email.rules!.required) }
                                type="email"
                                value={ formState.email }
                                onChange={ onEmailChange }
                            />
                            <FormInput
                                alertMessages={ buildFieldAlerts(componentConfig.message.id) }
                                autoComplete="off"
                                componentRef={ refs.message }
                                disabled={ formState.isSubmitting }
                                helpMessage={ componentConfig.message.helpMessage }
                                id={ componentConfig.message.id }
                                label={ componentConfig.message.label }
                                maxLength={ componentConfig.message.rules!.maxLength.value }
                                required={ Boolean(componentConfig.message.rules!.required) }
                                rows={ 5 }
                                type="textarea"
                                value={ formState.message }
                                onChange={ onMessageChange }
                            />
                            <FormFile
                                alertMessages={ buildFieldAlerts(componentConfig.files.id) }
                                componentRef={ refs.files }
                                disabled={ formState.isSubmitting }
                                helpMessage={ componentConfig.files.helpMessage }
                                id={ componentConfig.files.id }
                                label={ componentConfig.files.label }
                                maxFiles={ componentConfig.files.rules!.maxArrayLength.value }
                                maxFileSize={ componentConfig.files.rules!.maxFileSize.value }
                                maxTotalFileSize={ componentConfig.files.rules!.maxTotalFileSize.value }
                                required={ Boolean(componentConfig.files.rules!.required) }
                                onChange={ onFilesChange }
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
                                Send
                                <EmailIcon className="button-icon-right" />
                            </Button>
                        </FormControls>
                    </Form>
                </section>
            </div>
        );
    };

    useDidUpdate(onEmailChanged, [formState.email]);
    useDidUpdate(onMessageChanged, [formState.message]);
    useDidUpdate(onFilesChanged, [formState.files]);

    return render();
};

ContactPage.displayName = 'ContactPage';

ContactPage.DEFAULT_STATE = DEFAULT_STATE;

ContactPage.DEFAULT_FORM_STATE = DEFAULT_FORM_STATE;

export default ContactPage;
