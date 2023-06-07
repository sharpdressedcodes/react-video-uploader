import React, { ChangeEvent, HTMLAttributes, HTMLProps, memo, useState } from 'react';
import Button, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { classNames, isArrayEmpty, maybePromiseResolver } from '../../../../../common';
import { DefaultPropsType, PropsType } from '../types';
import '../styles/form-file.scss';

export const defaultProps: DefaultPropsType = {
    allowedFileExtensions: [],
    className: '',
    enabled: true,
    id: '',
    multiple: false,
    name: '',
    onChange: () => {},
    onValidate: () => [],
};

const FormFile = ({
    allowedFileExtensions = defaultProps.allowedFileExtensions,
    className = defaultProps.className,
    enabled = defaultProps.enabled,
    id = defaultProps.id,
    multiple = defaultProps.multiple,
    name = defaultProps.name,
    onChange = defaultProps.onChange,
    onValidate = defaultProps.onValidate,
}: PropsType) => {
    const [selectedFiles, setSelectedFiles] = useState<Nullable<File[]>>(null);
    const onChanged = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from((event.target as HTMLInputElement).files as FileList);

        if (isArrayEmpty(files)) {
            setSelectedFiles(null);
            await maybePromiseResolver(onChange(null));
            return;
        }

        const validFiles = await maybePromiseResolver(onValidate(files));

        if (!validFiles.length) {
            // eslint-disable-next-line no-param-reassign
            event.target.value = '';
            return;
        }

        setSelectedFiles(validFiles);
        await maybePromiseResolver(onChange(validFiles));
    };
    const selectButtonAttributes: MuiButtonProps<'label', { component: 'label' }> = {
        variant: 'contained',
        component: 'label',
        color: 'secondary',
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
            <Button { ...selectButtonAttributes }>
                Choose File{multiple ? 's' : ''}
                <AddIcon className="button-icon-right" />
                <input { ...inputAttributes } />
            </Button>
        </div>
    );
};

FormFile.displayName = 'FormFile';

export default memo<PropsType>(FormFile);
