import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConfigContext, ToastContext } from '../../../../context';
import { formatFileSize, isArrayEmpty, isObjectEmpty } from '../../../../common';
import InfoTable from '../../../InfoTable';
import Uploader from '../../../Uploader';
import useDidUpdate from '../../../../hooks/useDidUpdate';
import { loadVideosSuccess } from '../../../../state/reducers/loadVideos';
import '../styles/upload-page.scss';

const UploadPage = () => {
    const config = useContext(ConfigContext);
    const toast = useContext(ToastContext);
    const dispatch = useDispatch();
    const { uploadValidationErrors, uploadError, uploadResult, uploadValidation } = useSelector(({ uploaderReducer }) => uploaderReducer);
    const maxFiles = config.get('videoUpload.maxFiles', 0);
    const maxFileSize = config.get('videoUpload.maxFileSize', 0);
    const maxTotalFileSize = config.get('videoUpload.maxTotalFileSize', 0);
    const allowedFileExtensions = config.get('allowedFileExtensions', []);
    const formattedMaxFileSize = formatFileSize(maxFileSize);
    const formattedMaxTotalFileSize = formatFileSize(maxTotalFileSize);

    const generateInfo = () => ([
        { title: 'Allowed file types:', text: allowedFileExtensions.join(', ') },
        { title: 'Maximum file size:', text: formattedMaxFileSize },
        { title: 'Maximum files:', text: maxFiles },
        { title: 'Maximum files size:', text: formattedMaxTotalFileSize },
    ]);

    useDidUpdate(prevProps => {
        const errorMessages = [];

        if (!isObjectEmpty(uploadValidation) && !uploadValidation.success) {
            uploadValidation.overallErrors.forEach(err => errorMessages.push(err));

            if (!isObjectEmpty(uploadValidation?.fileErrors)
                && prevProps?.uploadValidation?.fileErrors !== uploadValidation.fileErrors) {
                Object
                    .values(uploadValidation.fileErrors)
                    .forEach(values => {
                        values.forEach(value => errorMessages.push(value));
                    })
                ;
            }
        }

        if (uploadError && !prevProps.uploadError) {
            errorMessages.push(uploadError);
        }

        if (!isArrayEmpty(errorMessages)) {
            toast.error(errorMessages.join('\n'));
        } else if (uploadResult && !prevProps.uploadResult) {
            toast.success('Upload complete');

            dispatch(loadVideosSuccess(uploadResult.items));
        }
    }, [uploadValidationErrors, uploadError, uploadResult, uploadValidation]);

    return (
        <div className="page-upload">
            <h2>Upload</h2>

            <section className="content">
                <InfoTable items={ generateInfo() } />
                <Uploader
                    url={ config.get('endpoints.api.video.upload') }
                    multiple
                    progress
                    maxFiles={ maxFiles }
                    maxFileSize={ maxFileSize }
                    maxTotalFileSize={ maxTotalFileSize }
                    allowedFileExtensions={ allowedFileExtensions }
                />
            </section>
        </div>
    );
};

UploadPage.displayName = 'UploadPage';

export default UploadPage;
