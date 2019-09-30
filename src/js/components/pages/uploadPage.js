import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connectToStores } from 'fluxible-addons-react';
import get from 'lodash/get';
import { toast } from 'react-toastify';
import { formatFileSize } from '../../helpers/format';
import InfoTable from '../infoTable';
import Uploader from '../uploader';

class UploadPage extends Component {
    static displayName= 'UploadPage';

    static propTypes = {
        uploadValidationErrors: PropTypes.arrayOf(PropTypes.string),
        uploadError: PropTypes.string,
        uploadResult: PropTypes.object
    };

    static defaultProps = {
        uploadValidationErrors: [],
        uploadError: null,
        uploadResult: null
    };

    static contextTypes = {
        config: PropTypes.object,
        getStore: PropTypes.func
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
        const { config } = this.context;
        const maxFiles = get(config, 'app.videoUpload.maxFiles', 0);
        const maxFileSize = get(config, 'app.videoUpload.maxFileSize', 0);
        const maxTotalFileSize = get(config, 'app.videoUpload.maxTotalFileSize', 0);
        const allowedFileTypes = get(config, 'app.videoUpload.allowedFileTypes', []);
        const formattedMaxFileSize = formatFileSize(maxFileSize);
        const formattedMaxTotalFileSize = formatFileSize(maxTotalFileSize);

        return [
            {title: 'Allowed file types:', text: allowedFileTypes.join(', ')},
            {title: 'Maximum file size:', text: formattedMaxFileSize},
            {title: 'Maximum total file size:', text: formattedMaxTotalFileSize},
            {title: 'Maximum files:', text: maxFiles},
        ];
    }

    getCsrfToken() {
        const element = document.querySelector('meta[name="csrf-token"]');
        let token = null;

        if (element) {
            token = element.getAttribute('content');
            if (token) {
                axios.defaults.headers.post['X-XSRF-TOKEN'] = token;
            }
        }

        return token;
    }

    render() {
        const { config } = this.context;
        const token = this.getCsrfToken();

        return (
            <div className="page-upload">
                <h2>Upload</h2>
                <section className="content">
                    <InfoTable items={this.generateInfo()} />
                    <Uploader
                        url={config.app.endpoints.api.video.upload}
                        csrf={token}
                        multiple
                        progress
                    />
                </section>
            </div>
        );
    }
}

const ConnectedUploadPage = connectToStores(UploadPage, ['AppStore'], (context, props) => {
    const appStore = context.getStore('AppStore');
    const uploadValidationErrors = appStore.getUploadValidationErrors();
    const uploadError = appStore.getUploadError();
    const uploadResult = appStore.getUploadResult();
    return {
        uploadValidationErrors,
        uploadError,
        uploadResult
    };

});

export const DisconnectedUploadPage = UploadPage;
export default ConnectedUploadPage;
