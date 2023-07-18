import React, {
    ChangeEvent,
    DragEvent,
    HTMLAttributes,
    HTMLProps,
    KeyboardEvent,
    memo,
    RefObject,
    useEffect,
    useRef,
    useState,
} from 'react';
import Button, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import DropZone from '../../../../DropZone';
import FileRestrictions from './FileRestrictions';
import FormField from '../../FormField';
import FormLabel from '../../FormLabel';
import FormFieldRenderer, { defaultProps as defaultFormFieldRendererProps } from '../../FormField/components/FormFieldRenderer';
import FormFieldAlerts from '../../FormField/components/FormFieldAlerts';
import FormFieldHelp from '../../FormField/components/FormFieldHelp';
import { classNames, isArrayEmpty, maybePromiseResolver } from '../../../../../common';
import { DefaultPropsType, PropsType, SingleAndMultipleTextType } from '../types';
import '../styles/form-file.scss';

export const defaultButtonText: SingleAndMultipleTextType = {
    single: 'Choose file',
    multiple: 'Choose files',
};
export const defaultButtonSelectedText: SingleAndMultipleTextType = {
    single: 'Change file',
    multiple: 'Change files',
};
export const defaultDropZoneText: SingleAndMultipleTextType = {
    single: 'or drag it here.',
    multiple: 'or drag them here.',
};
export const defaultDropZoneDraggingText: SingleAndMultipleTextType = {
    single: 'or drop it here.',
    multiple: 'or drop them here.',
};

export const defaultProps: DefaultPropsType = {
    alertMessages: null,
    allowedFileExtensions: [],
    className: '',
    componentRef: null,
    disabled: false,
    elementOrder: defaultFormFieldRendererProps.order,
    helpMessage: null,
    label: null,
    maxFiles: 0,
    maxFileSize: 0,
    maxTotalFileSize: 0,
    multiple: false,
    name: '',
    buttonText: defaultButtonText,
    buttonSelectedText: defaultButtonSelectedText,
    dropZoneText: defaultDropZoneText,
    dropZoneDraggingText: defaultDropZoneDraggingText,
    required: false,
    showRestrictions: true,
    useDragAndDrop: true,
    onChange: () => {},
};

// Will be checked against window for data transfer support
const propertyTests = [
    'FileReader',
    'FormData',
];

const FormFile = ({
    alertMessages = defaultProps.alertMessages,
    allowedFileExtensions = defaultProps.allowedFileExtensions,
    buttonText = defaultProps.buttonText,
    buttonSelectedText = defaultProps.buttonSelectedText,
    className = defaultProps.className,
    componentRef = defaultProps.componentRef,
    dropZoneText = defaultProps.dropZoneText,
    dropZoneDraggingText = defaultProps.dropZoneDraggingText,
    disabled = defaultProps.disabled,
    elementOrder = defaultProps.elementOrder,
    helpMessage = defaultProps.helpMessage,
    label = defaultProps.label,
    id,
    maxFiles = defaultProps.maxFiles,
    maxFileSize = defaultProps.maxFileSize,
    maxTotalFileSize = defaultProps.maxTotalFileSize,
    multiple = defaultProps.multiple,
    name = defaultProps.name,
    required = defaultProps.required,
    showRestrictions = defaultProps.showRestrictions,
    useDragAndDrop = defaultProps.useDragAndDrop,
    onChange = defaultProps.onChange,
}: PropsType) => {
    const ref = useRef<boolean>(false);
    const inputRef = componentRef ?? useRef<Nullable<HTMLInputElement>>(null);
    const [isSupported, setIsSupported] = useState(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<Nullable<File[]>>(null);
    const helpId = `${id}-help`;
    const alertsId = `${id}-alerts`;
    const isMultiple = multiple || maxFiles;

    const onChanged = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = (event.target as HTMLInputElement).files as FileList;

        if (isArrayEmpty(files)) {
            setSelectedFiles(null);
            await maybePromiseResolver(onChange(null));
            return;
        }

        const f = Array.from(files);

        setSelectedFiles(f);
        await maybePromiseResolver(onChange(f));
    };
    const onDrop = async (event: DragEvent<HTMLDivElement>) => {
        // console.log('onDrop', event.dataTransfer.files, event.dataTransfer.items, event.dataTransfer.types, event);

        let files = event.dataTransfer.files;
        const len = files.length;

        // There is no way of enforcing "multiple='false'" on the drag and drop operation.
        // So instead, we emulate browser behaviour when selecting files from dialog.
        // In that scenario, the browser will select the last selected file only, and ignore the rest.
        if (!multiple && len > 1) {
            const dt = new DataTransfer();

            dt.items.add(files[files.length - 1]);
            files = dt.files;
        }

        if (maxFiles && len > maxFiles) {
            const dt = new DataTransfer();

            for (let i = len - maxFiles; i < maxFiles; i++) {
                dt.items.add(files[i]);
            }

            files = dt.files;
        }

        const f = Array.from(files);

        setSelectedFiles(f);
        await maybePromiseResolver(onChange(f));
    };
    const onDraggingChanged = (dragging: boolean) => {
        setIsDragging(dragging);
    };
    const onLabelKeyDown = (event: KeyboardEvent<HTMLLabelElement>) => {
        // Open dialog when user types 'Enter' or 'Space'
        if (['Enter', ' '].includes(event.key)) {
            inputRef.current!.click();
        }
    };
    const buildDescribedBy = () => {
        const describedBy: string[] = [];

        if (helpMessage) {
            describedBy.push(helpId);
        }

        if (alertMessages) {
            describedBy.push(alertsId);
        }

        return describedBy.join(' ');
    };
    const renderRestrictions = () => (!showRestrictions ? null : (
        <FileRestrictions
            allowedFileExtensions={ allowedFileExtensions }
            maxFiles={ maxFiles }
            maxFileSize={ maxFileSize }
            maxTotalFileSize={ maxTotalFileSize }
        />
    ));
    const renderText = (): string => {
        if (!isArrayEmpty(selectedFiles)) {
            return (isMultiple ? buttonSelectedText.multiple : buttonSelectedText.single) as string;
        }

        return (isMultiple ? buttonText.multiple : buttonText.single) as string;
    };
    const renderDropZoneText = (): string => {
        if (isDragging) {
            return (isMultiple ? dropZoneDraggingText.multiple : dropZoneDraggingText.single) as string;
        }

        return (isMultiple ? dropZoneText.multiple : dropZoneText.single) as string;
    };
    const renderInput = (dragAndDropVersion: boolean = false) => {
        const selectButtonAttributes: MuiButtonProps<'label', { component: 'label' }> = {
            color: dragAndDropVersion ? 'inherit' : 'secondary',
            component: 'label',
            variant: dragAndDropVersion ? 'text' : 'contained',
            onKeyDown: onLabelKeyDown,
        };
        const inputAttributes: HTMLProps<HTMLInputElement> & HTMLAttributes<HTMLInputElement> = {
            'aria-describedby': buildDescribedBy(),
            id,
            name: name || id,
            ref: inputRef as RefObject<HTMLInputElement>,
            style: { display: 'none' },
            type: 'file',
            onChange: onChanged,
        };
        const hasError = Array.isArray(alertMessages) &&
            !isArrayEmpty(alertMessages) &&
            Boolean(alertMessages.find(({ severity }) => severity === 'error'));

        if (disabled) {
            selectButtonAttributes.disabled = true;
        }

        if (!isArrayEmpty(allowedFileExtensions)) {
            inputAttributes.accept = allowedFileExtensions?.map(f => `.${f}`).join(',');
        }

        if (isMultiple) {
            inputAttributes.multiple = true;
        }

        if (dragAndDropVersion) {
            return (
                <div className={ classNames('form-file', className) }>
                    <Button { ...selectButtonAttributes }>
                        {renderText()}
                        <input { ...inputAttributes } />
                    </Button>
                </div>
            );
        }

        return (
            <FormField>
                <div className={ classNames('form-file', className) }>
                    <FormFieldRenderer
                        order={ elementOrder }
                        label={ label && <FormLabel htmlFor={ id } required={ required }>{label}</FormLabel> }
                        help={ helpMessage && <FormFieldHelp id={ helpId }>{helpMessage}</FormFieldHelp> }
                        element={ (
                            <div
                                className={ classNames('form-file__wrapper', {
                                    'form-file__wrapper--has-error': hasError,
                                }) }
                            >
                                {renderRestrictions()}
                                <Button { ...selectButtonAttributes }>
                                    {renderText()}
                                    <AddIcon className="button-icon-right" />
                                    <input { ...inputAttributes } />
                                </Button>
                            </div>
                        ) }
                        error={ alertMessages && (
                            <FormFieldAlerts
                                htmlFor={ id }
                                id={ alertsId }
                                messages={ alertMessages }
                            />
                        ) }
                    />
                </div>
            </FormField>
        );
    };
    const render = () => {
        const fallback = renderInput();
        const hasError = Array.isArray(alertMessages) &&
            !isArrayEmpty(alertMessages) &&
            Boolean(alertMessages.find(({ severity }) => severity === 'error'));

        if (useDragAndDrop && isSupported) {
            return (
                <FormField>
                    <FormFieldRenderer
                        order={ elementOrder }
                        label={ label && <FormLabel htmlFor={ id } required={ required }>{label}</FormLabel> }
                        help={ helpMessage && <FormFieldHelp id={ helpId }>{helpMessage}</FormFieldHelp> }
                        element={ (
                            <DropZone
                                className={ classNames('form-file__drop-zone', {
                                    'form-file__drop-zone--has-error': hasError,
                                }) }
                                fallback={ fallback }
                                onDraggingChanged={ onDraggingChanged }
                                onDrop={ onDrop }
                            >
                                <div>
                                    {renderRestrictions()}
                                    <div className="form-file__drop-zone file-wrapper">
                                        {renderInput(true)}
                                        <Typography variant="button" component="span" color="text.secondary" className="drop-zone__content-suffix">
                                            {renderDropZoneText()}
                                        </Typography>
                                    </div>
                                </div>
                            </DropZone>
                        ) }
                        error={ alertMessages && (
                            <FormFieldAlerts
                                htmlFor={ id }
                                id={ alertsId }
                                messages={ alertMessages }
                            />
                        ) }
                    />
                </FormField>
            );
        }

        return fallback;
    };

    useEffect(() => {
        if (!ref.current) {
            ref.current = true;

            const supported = propertyTests.every(prop => prop in window);

            if (supported !== isSupported) {
                setIsSupported(supported);
            }
        }
    }, []);

    return render();
};

FormFile.displayName = 'FormFile';

export default memo<PropsType>(FormFile);
