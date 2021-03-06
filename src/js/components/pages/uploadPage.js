import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import config from 'react-global-configuration';
import { formatFileSize } from '../../shared/format';
import InfoTable from '../infoTable';
import Uploader from '../uploader';

class UploadPage extends Component {
    static displayName= 'UploadPage';

    static propTypes = {
        uploadValidationErrors: PropTypes.arrayOf(PropTypes.string),
        uploadError: PropTypes.string,
        uploadResult: PropTypes.object,
    };

    static defaultProps = {
        uploadValidationErrors: [],
        uploadError: null,
        uploadResult: null,
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const { uploadValidationErrors, uploadError, uploadResult } = this.props;
        const validationErrorsChanged = uploadValidationErrors !== nextProps.uploadValidationErrors;
        const errorChanged = uploadError !== nextProps.uploadError;
        const resultChanged = uploadResult !== nextProps.uploadResult;

        return validationErrorsChanged || errorChanged || resultChanged;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { uploadValidationErrors, uploadError, uploadResult } = this.props;

        if (uploadValidationErrors.length) {
            uploadValidationErrors.map(toast.error);
        }

        if (uploadError) {
            toast.error(uploadError);
        }

        if (uploadResult) {
            toast.success('Upload complete');
        }

    }

    generateInfo() {
        const maxFiles = config.get('app.videoUpload.maxFiles', 0);
        const maxFileSize = config.get('app.videoUpload.maxFileSize', 0);
        const maxTotalFileSize = config.get('app.videoUpload.maxTotalFileSize', 0);
        const allowedFileTypes = config.get('app.videoUpload.allowedFileTypes', []);
        const formattedMaxFileSize = formatFileSize(maxFileSize);
        const formattedMaxTotalFileSize = formatFileSize(maxTotalFileSize);

        return [
            {title: 'Allowed file types:', text: allowedFileTypes.join(', ')},
            {title: 'Maximum file size:', text: formattedMaxFileSize},
            {title: 'Maximum total file size:', text: formattedMaxTotalFileSize},
            {title: 'Maximum files:', text: maxFiles},
        ];
    }

    render() {

        return (
            <div className="page-upload">
                <h2>Upload</h2>
                <section className="content">
                    <InfoTable items={this.generateInfo()} />
                    <Uploader
                        url={config.get('app.endpoints.api.video.upload')}
                        multiple
                        progress
                    />
                </section>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { uploaderReducer: reducer } = state;
    const { uploadValidationErrors, uploadError, uploadResult } = reducer;
    return {
        uploadValidationErrors,
        uploadError,
        uploadResult,
    };
};

const ConnectedUploadPage = connect(mapStateToProps)(UploadPage);
export const DisconnectedUploadPage = UploadPage;
export default ConnectedUploadPage;
