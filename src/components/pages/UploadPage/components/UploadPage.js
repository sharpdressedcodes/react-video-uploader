import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash.isequal';
import { toast } from 'react-toastify';
import { ConfigContext } from '../../../../context/Config';
import { formatFileSize, isObjectEmpty } from '../../../../common';
import { InfoTable, Uploader } from '../../../index';
import '../styles/upload-page.scss';

class UploadPage extends Component {
    static displayName = 'UploadPage';

    static contextType = ConfigContext;

    static propTypes = {
        uploadValidationErrors: PropTypes.arrayOf(PropTypes.string),
        uploadError: PropTypes.string,
        uploadResult: PropTypes.object,
        uploadValidation: PropTypes.object
    };

    static defaultProps = {
        uploadValidationErrors: [],
        uploadError: null,
        uploadResult: null,
        uploadValidation: null
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState) || !isEqual(this.context, nextContext);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { uploadValidationErrors, uploadError, uploadResult, uploadValidation } = this.props;

        if (!isObjectEmpty(uploadValidation) && !uploadValidation.success) {
            uploadValidation.overallErrors.map(toast.error);

            if (!isObjectEmpty(uploadValidation.fileErrors)) {
                Object.entries(uploadValidation.fileErrors).map(([, values]) => values.map(toast.error));
            }
        }

        if (uploadError) {
            toast.error(uploadError);
        }

        if (uploadResult) {
            toast.success('Upload complete');
        }
    }

    generateInfo() {
        const { config } = this.context;
        const maxFiles = config.get('videoUpload.maxFiles', 0);
        const maxFileSize = config.get('videoUpload.maxFileSize', 0);
        const maxTotalFileSize = config.get('videoUpload.maxTotalFileSize', 0);
        const allowedFileExtensions = config.get('allowedFileExtensions', []);
        const formattedMaxFileSize = formatFileSize(maxFileSize);
        const formattedMaxTotalFileSize = formatFileSize(maxTotalFileSize);

        return [
            { title: 'Allowed file types:', text: allowedFileExtensions.join(', ') },
            { title: 'Maximum file size:', text: formattedMaxFileSize },
            { title: 'Maximum files:', text: maxFiles },
            { title: 'Maximum files size:', text: formattedMaxTotalFileSize }
        ];
    }

    render() {
        const { config } = this.context;
        const maxFiles = config.get('videoUpload.maxFiles', 0);
        const maxFileSize = config.get('videoUpload.maxFileSize', 0);
        const maxTotalFileSize = config.get('videoUpload.maxTotalFileSize', 0);
        const allowedFileExtensions = config.get('allowedFileExtensions', []);

        return (
            <div className="page-upload">
                <h2>Upload</h2>
                <section className="content">
                    <InfoTable items={ this.generateInfo() } />
                    <Uploader
                        url={ this.context.config.get('endpoints.api.video.upload') }
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
    }
}

const mapStateToProps = state => {
    const { uploaderReducer: reducer } = state;
    const { uploadValidationErrors, uploadError, uploadResult, uploadValidation } = reducer;

    return {
        uploadValidationErrors,
        uploadError,
        uploadResult,
        uploadValidation
    };
};

const ConnectedUploadPage = connect(mapStateToProps)(UploadPage);

export const DisconnectedUploadPage = UploadPage;
export default ConnectedUploadPage;
