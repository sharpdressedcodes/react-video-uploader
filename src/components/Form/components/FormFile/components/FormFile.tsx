import React, { ChangeEvent, DragEvent, HTMLAttributes, HTMLProps, memo, useEffect, useRef, useState } from 'react';
import Button, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { DropZone } from '../../../../DropZone';
import { FileRestrictions } from './FileRestrictions';
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
    allowedFileExtensions: [],
    className: '',
    enabled: true,
    id: '',
    maxFiles: 0,
    maxFileSize: 0,
    maxTotalFileSize: 0,
    multiple: false,
    name: '',
    buttonText: defaultButtonText,
    buttonSelectedText: defaultButtonSelectedText,
    dropZoneText: defaultDropZoneText,
    dropZoneDraggingText: defaultDropZoneDraggingText,
    showRestrictions: true,
    useDragAndDrop: true,
    onChange: () => {},
    onValidate: () => [],
};

// Will be checked against window for data transfer support
const propertyTests = [
    'FileReader',
    'FormData',
];

const FormFile = ({
    allowedFileExtensions = defaultProps.allowedFileExtensions,
    buttonText = defaultProps.buttonText,
    buttonSelectedText = defaultProps.buttonSelectedText,
    className = defaultProps.className,
    dropZoneText = defaultProps.dropZoneText,
    dropZoneDraggingText = defaultProps.dropZoneDraggingText,
    enabled = defaultProps.enabled,
    id = defaultProps.id,
    maxFiles = defaultProps.maxFiles,
    maxFileSize = defaultProps.maxFileSize,
    maxTotalFileSize = defaultProps.maxTotalFileSize,
    multiple = defaultProps.multiple,
    name = defaultProps.name,
    useDragAndDrop = defaultProps.useDragAndDrop,
    showRestrictions = defaultProps.showRestrictions,
    onChange = defaultProps.onChange,
    onValidate = defaultProps.onValidate,
}: PropsType) => {
    const ref = useRef<boolean>(false);
    const [isSupported, setIsSupported] = useState(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<Nullable<File[]>>(null);

    const validate = async (files: FileList) => {
        if (isArrayEmpty(files)) {
            setSelectedFiles(null);
            await maybePromiseResolver(onChange(null));
            return false;
        }

        const validFiles = await maybePromiseResolver(onValidate(Array.from(files)));

        if (!validFiles.length) {
            // eslint-disable-next-line no-param-reassign
            // event.target.value = '';
            setSelectedFiles(null);
            await maybePromiseResolver(onChange(null));
            return false;
        }

        setSelectedFiles(validFiles);
        await maybePromiseResolver(onChange(validFiles));

        return true;
    };
    const onChanged = async (event: ChangeEvent<HTMLInputElement>) => {
        // const files = Array.from((event.target as HTMLInputElement).files as FileList);
        const files = (event.target as HTMLInputElement).files as FileList;

        const validated = await validate(files);
        // if (isArrayEmpty(files)) {
        //     setSelectedFiles(null);
        //     await maybePromiseResolver(onChange(null));
        //     return;
        // }
        //
        // const validFiles = await maybePromiseResolver(onValidate(files));
        //
        // if (!validFiles.length) {
        //     // eslint-disable-next-line no-param-reassign
        //     event.target.value = '';
        //     return;
        // }
        //
        // setSelectedFiles(validFiles);
        // await maybePromiseResolver(onChange(validFiles));
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

        const validated = await validate(files);
    };
    const onDraggingChanged = (dragging: boolean) => {
        setIsDragging(dragging);
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
            return (multiple ? buttonSelectedText.multiple : buttonSelectedText.single) as string;
        }

        return (multiple ? buttonText.multiple : buttonText.single) as string;
    };
    const renderDropZoneText = (): string => {
        if (isDragging) {
            return (multiple ? dropZoneDraggingText.multiple : dropZoneDraggingText.single) as string;
        }

        return (multiple ? dropZoneText.multiple : dropZoneText.single) as string;
    };
    const render = (dragAndDropVersion: boolean = false) => {
        const selectButtonAttributes: MuiButtonProps<'label', { component: 'label' }> = {
            color: dragAndDropVersion ? 'inherit' : 'secondary',
            component: 'label',
            variant: dragAndDropVersion ? 'text' : 'contained',
        };
        const inputAttributes: HTMLProps<HTMLInputElement> & HTMLAttributes<HTMLInputElement> = {
            id,
            onChange: onChanged,
            name,
            style: { display: 'none' },
            type: 'file',
        };

        if (!enabled) {
            selectButtonAttributes.disabled = true;
        }

        if (!isArrayEmpty(allowedFileExtensions)) {
            inputAttributes.accept = allowedFileExtensions?.map(f => `.${f}`).join(',');
        }

        if (multiple) {
            inputAttributes.multiple = true;
        }

        return (
            <div className={ classNames('form-file', className) }>
                {!dragAndDropVersion && renderRestrictions()}
                <Button { ...selectButtonAttributes }>
                    {renderText()}
                    {!dragAndDropVersion && <AddIcon className="button-icon-right" />}
                    <input { ...inputAttributes } />
                </Button>
            </div>
        );
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

    const fallback = render();

    if (useDragAndDrop && isSupported) {
        return (
            <DropZone
                className="form-file__drop-zone"
                fallback={ fallback }
                onDraggingChanged={ onDraggingChanged }
                onDrop={ onDrop }
            >
                <div>
                    {renderRestrictions()}
                    <div className="form-file__drop-zone file-wrapper">
                        {render(true)}
                        <Typography variant="button" component="span" color="text.secondary" className="drop-zone__content-suffix">
                            {renderDropZoneText()}
                        </Typography>
                    </div>
                </div>
            </DropZone>
        );
    }

    return fallback;
};

FormFile.displayName = 'FormFile';

export default memo<PropsType>(FormFile);
