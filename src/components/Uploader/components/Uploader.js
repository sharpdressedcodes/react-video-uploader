import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import xhrAdapter from 'axios/lib/adapters/xhr';
import { connect } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { uploadError, uploadProgress, uploadStart, uploadSuccess, uploadValidationErrors } from '../../../actions/uploader';
import { loadVideosSuccess } from '../../../actions/loadVideos';
import { fileValidation, formatFileSize, isArrayEmpty, SimpleWebSocket } from '../../../common';
import { ConfigContext } from '../../../context/Config';

class Uploader extends Component {
    static displayName = 'Uploader';

    static DEFAULT_STATE = {
        selectedFiles: null,
        loaded: 0,
        uploading: false,
        uploadedFiles: []
    };

    static contextType = ConfigContext;

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

    constructor(...args) {
        super(...args);

        const { config } = this.context;

        this.maxFileSize = config.get('videoUpload.maxFileSize', 0);
        this.allowedFileTypes = config.get('videoUpload.allowedFileTypes', []);
        this.maxFiles = config.get('videoUpload.maxFiles', 0);
        this.maxTotalFileSize = config.get('videoUpload.maxTotalFileSize', 0);
        this.webSocket = null;
        this.state = { ...Uploader.DEFAULT_STATE };
    }

    componentDidMount() {
        this.webSocket = new SimpleWebSocket();

        this.webSocket.addEventListeners({
            onOpen: this.onWebSocketOpen,
            onMessage: this.onWebSocketMessage,
            onError: this.onWebSocketError,
            onClose: this.onWebSocketClose
        });
    }

    componentWillUnmount() {
        this.webSocket.removeEventListeners({
            onOpen: this.onWebSocketOpen,
            onMessage: this.onWebSocketMessage,
            onError: this.onWebSocketError,
            onClose: this.onWebSocketClose
        });

        this.webSocket = null;
    }

    // eslint-disable-next-line class-methods-use-this
    onWebSocketOpen = event => {
        // console.log('websocket open', event);
    };

    onWebSocketMessage = event => {
        // console.log('websocket message', event);
        const message = JSON.parse(event.data);

        switch (message.event) {
            case 'upload.step':
                this.onUploadStep(message.data);
                break;
            case 'upload.step.file':
                this.onUploadStepFile(message.data);
                break;
            case 'upload.step.file.progress':
                this.onUploadStepFileProgress(message.data);
                break;
            default:
        }
    };

    // eslint-disable-next-line class-methods-use-this
    onWebSocketError = err => {
        // console.log('websocket error', err);
    };

    // eslint-disable-next-line class-methods-use-this
    onWebSocketClose = event => {
        // console.log('websocket close', event);
    };

    // eslint-disable-next-line class-methods-use-this
    onUploadStep = params => {
        const { step, total, status } = params;
        /* step: 3,
        total: 3,
        status: 'Parsing' */
        // console.log('---> onUploadStep', params);

        // if (step === total) {
        //     this.setState({ uploadedFiles: [] });
        // }
    };

    onUploadStepFile = params => {
        const { index } = params;
        const { uploadedFiles } = this.state;

        uploadedFiles[index] = params;
        this.setState({ uploadedFiles });
    };

    onUploadStepFileProgress = params => {
        const { index } = params;
        const { uploadedFiles } = this.state;

        uploadedFiles[index] = params;
        this.setState({ uploadedFiles });

        // console.log('upload.step.file.progress', params);
    };

    onChange = async event => {
        const { allowedFileTypes, maxFiles, maxFileSize, maxTotalFileSize } = this;
        const { actions } = this.props;
        const state = { ...Uploader.DEFAULT_STATE };
        const files = Array.from(event.target.files);

        if (isArrayEmpty(files)) {
            // User opened dialog, then clicked cancel
            this.setState(state);
            return;
        }

        const result = await fileValidation({
            files,
            allowedFileTypes,
            maxFiles,
            maxFileSize,
            maxTotalFileSize
        });

        if (!result.success) {
            // eslint-disable-next-line no-param-reassign
            event.target.value = null;
            actions.uploadValidationErrors({ validation: result });
        } else {
            state.selectedFiles = files;
            state.uploadedFiles = [];
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

            // TODO: move this into api
            const result = await axios.post(url, data, {
                onUploadProgress: ProgressEvent => {
                    const percentage = (ProgressEvent.loaded / ProgressEvent.total) * 100;

                    actions.uploadProgress({ percentage });
                    this.setState({ loaded: percentage });
                },
                adapter: xhrAdapter
            });

            if (result.data.validation) {
                actions.uploadValidationErrors({ validation: result.data.validation });
            } else {
                actions.uploadSuccess({ result: result.data });
                actions.loadVideosSuccess({ items: result.data.items });
            }
        } catch (err) {
            actions.uploadError({ error: err.message });
        } finally {
            this.setState({ uploading: false, loaded: 0, uploadedFiles: [] });
            // Uncomment below to auto reset after upload
            // this.setState({ ...Uploader.DEFAULT_STATE });
        }
    };

    render() {
        const { loaded, selectedFiles, uploading, uploadedFiles } = this.state;
        const { url, multiple, progress } = this.props;
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
                    {selectedFiles.map((item, index) => {
                        const uploadItem = uploadedFiles[index];
                        let s = 'Ready to upload';
                        let progress2 = 0;

                        if (uploadItem && uploadItem.status) {
                            const { step, total, status } = uploadItem;

                            s = `Step ${step} of ${total} - ${status}`;
                        }

                        if (uploadItem && uploadItem.percent) {
                            progress2 = uploadItem.percent;
                        }

                        return (
                            <li key={ item.name } className="file">
                                <span className="file-index">{index + 1}.</span>
                                <span className="file-name">{item.name}</span>
                                <span className="file-size">{formatFileSize(item.size)}</span>
                                <span className="file-status">{s}</span>
                                <span className="file-progress">
                                    <LinearProgress className="status-progress" variant="determinate" value={ progress2 } />
                                </span>
                            </li>
                        );
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

        const progressElement = progress && selectedFiles ? <LinearProgress className="status-progress" variant="determinate" value={ loaded } /> : null;

        return (
            <section className="uploader">

                <form className="form form-upload" action={ url } method="post" onSubmit={ this.onSubmit }>

                    <div className="form-fields">
                        <div className="form-field">
                            <Button { ...selectButtonAttributes }>
                                Select Files
                                <AddIcon className="button-icon-right" />
                                <input { ...inputAttributes } />
                            </Button>
                        </div>
                    </div>

                    <div className="form-controls">
                        <Button { ...submitButtonAttributes }>
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
        // uploadValidationErrors: payload => dispatch(uploadValidationErrors(payload.errors)),
        uploadValidationErrors: payload => dispatch(uploadValidationErrors(payload.validation)),
        loadVideosSuccess: payload => dispatch(loadVideosSuccess(payload.items))
    }
});

const ConnectedUploader = connect(null, mapDispatchToProps)(Uploader);

export const DisconnectedUploader = Uploader;

export default ConnectedUploader;
