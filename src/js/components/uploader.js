import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import xhrAdapter from 'axios/lib/adapters/xhr';
import { connect } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {
    uploadError, uploadProgress, uploadStart, uploadSuccess, uploadValidationErrors
} from '../actions/uploader';
import { loadVideosSuccess } from '../actions/loadVideos';
import { formatFileSize } from '../shared/format';
import { validateFiles } from '../browser/fileValidator';

class Uploader extends Component {
    static displayName = 'Uploader';

    static DEFAULT_STATE = {
        selectedFiles: null,
        loaded: 0,
        uploading: false
    };

    static propTypes = {
        url: PropTypes.string.isRequired,
        multiple: PropTypes.bool,
        progress: PropTypes.bool,
        actions: PropTypes.object
    };

    static defaultProps = {
        multiple: false,
        progress: false,
        actions: {}
    };

    constructor(props) {
        super(props);

        this.state = { ...Uploader.DEFAULT_STATE };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const {
            url, multiple, progress
        } = this.props;
        const { selectedFiles, loaded, uploading } = this.state;
        const urlChanged = url !== nextProps.url;
        const multipleChanged = multiple !== nextProps.multiple;
        const progressChanged = progress !== nextProps.progress;
        const selectedFiledChanged = selectedFiles !== nextState.selectedFiles;
        const loadedChanged = loaded !== nextState.loaded;
        const uploadingChanged = uploading !== nextState.uploading;

        return urlChanged || multipleChanged || progressChanged
            || selectedFiledChanged || loadedChanged || uploadingChanged;
    }

    onChange = event => {
        const { actions } = this.props;
        const state = { ...Uploader.DEFAULT_STATE };
        const errors = validateFiles(Array.from(event.target.files));

        if (Array.isArray(errors)) {
            // eslint-disable-next-line no-param-reassign
            event.target.value = null;
            actions.uploadValidationErrors({ errors });
        } else {
            state.selectedFiles = event.target.files;
        }

        this.setState(state);
    };

    onSubmit = async event => {
        const { selectedFiles } = this.state;
        const { url, actions } = this.props;
        const data = new FormData();

        event.preventDefault();

        if (!selectedFiles) {
            actions.uploadValidationErrors({ errors: ['Error: No files selected'] });
            return;
        }

        const len = selectedFiles.length;

        for (let i = 0; i < len; i++) {
            data.append('file', selectedFiles[i]);
        }

        try {
            this.setState({ uploading: true, loaded: 0 });
            actions.uploadStart({ url });

            const result = await axios.post(url, data, {
                onUploadProgress: ProgressEvent => {
                    const percentage = (ProgressEvent.loaded / ProgressEvent.total * 100);

                    actions.uploadProgress({ percentage });
                    this.setState({ loaded: percentage });
                },
                adapter: xhrAdapter
            });

            if (result.data.errors && result.data.errors.length) {
                actions.uploadValidationErrors({ errors: result.data.errors });
            } else {
                actions.uploadSuccess({ result: result.data });
                actions.loadVideosSuccess({ items: result.data.items });
            }
        } catch (err) {
            actions.uploadError({ error: err.message });
        } finally {
            this.setState({ uploading: false, loaded: 0 });
            // Uncomment below to auto reset after upload
            // this.setState({ ...Uploader.DEFAULT_STATE });
        }
    };

    render() {
        const { loaded, selectedFiles, uploading } = this.state;
        const {
            url, multiple, progress
        } = this.props;
        const selectButtonAttributes = {
            variant: 'contained',
            component: 'label',
            color: 'primary'
        };
        const submitButtonAttributes = {
            variant: 'contained',
            component: 'button',
            type: 'submit'
        };
        const inputAttributes = {
            style: { display: 'none' },
            type: 'file',
            name: 'file',
            onChange: this.onChange
        };

        const files = !selectedFiles
            ? <span>No files selected</span>
            : (
                <ul className="files">
                    {Array.from(selectedFiles).map((item, index) => {
                        const key = `file-${index}`;
                        /* eslint-disable */
                        return (
                            <li key={key} className="file">
                                <span className="file-index">{index + 1}.</span>
                                <span className="file-name">{item.name}</span>
                                <span className="file-size">{formatFileSize(item.size)}</span>
                            </li>
                        );
                        /* eslint-enable */
                    })}
                </ul>
            );

        if (!selectedFiles || uploading) {
            submitButtonAttributes.disabled = true;
        }

        if (uploading) {
            selectButtonAttributes.disabled = true;
        }

        if (multiple) {
            inputAttributes.multiple = true;
        }

        const progressElement = progress ? <LinearProgress className="status-progress" variant="determinate" value={loaded} /> : null;

        return (
            <section className="uploader">

                <form className="form form-upload" action={url} method="post" onSubmit={this.onSubmit}>

                    <div className="form-fields">
                        <div className="form-field">
                            <Button {...selectButtonAttributes}>
                                Select Files
                                <AddIcon className="button-icon-right" />
                                <input {...inputAttributes} />
                            </Button>
                        </div>
                    </div>

                    <div className="form-controls">
                        <Button {...submitButtonAttributes}>
                            Upload
                            <CloudUploadIcon className="button-icon-right" />
                        </Button>
                    </div>

                </form>

                <div className="status">
                    <div className="status-files">{files}</div>
                    {progressElement}
                </div>

            </section>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    actions: {
        uploadError: payload => dispatch(uploadError(payload.error)),
        uploadProgress: payload => dispatch(uploadProgress(payload.progress)),
        uploadStart: payload => dispatch(uploadStart(payload.url)),
        uploadSuccess: payload => dispatch(uploadSuccess(payload.result)),
        uploadValidationErrors: payload => dispatch(uploadValidationErrors(payload.errors)),
        loadVideosSuccess: payload => dispatch(loadVideosSuccess(payload.items))
    }
});

const ConnectedUploader = connect(null, mapDispatchToProps)(Uploader);
export const DisconnectedUploader = Uploader;

export default ConnectedUploader;
