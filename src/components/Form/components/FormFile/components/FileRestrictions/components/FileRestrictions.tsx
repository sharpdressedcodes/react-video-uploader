import React, { Fragment, memo, useMemo } from 'react';
import { classNames, formatFileSize, isArrayEmpty } from '../../../../../../../common';
import { DefaultPropsType, PropsType } from '../types';
import '../styles/file-restrictions.scss';

export const defaultProps: DefaultPropsType = {
    allowedFileExtensions: [],
    className: '',
    maxFiles: 0,
    maxFileSize: 0,
    maxTotalFileSize: 0,
};

const FileRestrictions = ({
    allowedFileExtensions = defaultProps.allowedFileExtensions,
    className = defaultProps.className,
    maxFiles = defaultProps.maxFiles,
    maxFileSize = defaultProps.maxFileSize,
    maxTotalFileSize = defaultProps.maxTotalFileSize,
}: PropsType) => {
    const formattedMaxFileSize = formatFileSize(maxFileSize);
    const formattedMaxTotalFileSize = formatFileSize(maxTotalFileSize);
    const generateRestrictions = useMemo((): Record<string, string>[] => [
        !isArrayEmpty(allowedFileExtensions) && { title: 'Allowed file types', text: allowedFileExtensions.join(', ') },
        maxFileSize && { title: 'Maximum file size', text: formattedMaxFileSize },
        maxFiles && { title: 'Maximum files', text: maxFiles.toString() },
        maxTotalFileSize && { title: 'Maximum files size', text: formattedMaxTotalFileSize },
    ].filter(Boolean) as Record<string, string>[], [
        allowedFileExtensions,
        maxFiles,
        maxFileSize,
        maxTotalFileSize,
    ]);
    const restrictions = generateRestrictions.map(({ title, text }) => (
        <Fragment key={ title }>
            <span className="file-restrictions__title">{title}</span>
            <span>{text}</span>
        </Fragment>
    ));

    return isArrayEmpty(restrictions) ? null : (
        <div className={ classNames('file-restrictions', className) }>
            {restrictions}
        </div>
    );
};

FileRestrictions.displayName = 'FileRestrictions';

export default memo<PropsType>(FileRestrictions);
