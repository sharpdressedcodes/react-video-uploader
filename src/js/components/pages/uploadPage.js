import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import get from 'lodash/get';
import { formatFileSize } from '../../helpers/format';
import { toast } from 'react-toastify';
//import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import InfoTable from '../infoTable';

// const useStyles = makeStyles(theme => ({
//     button: {
//         margin: theme.spacing(1),
//     },
//     leftIcon: {
//         marginRight: theme.spacing(1),
//     },
//     rightIcon: {
//         marginLeft: theme.spacing(1),
//     },
//     iconSmall: {
//         fontSize: 20,
//     },
// }));

class UploadPage extends Component {
    static displayName= 'Upload';

    // static DEFAULT_MAX_FILES = 10;
    // static DEFAULT_MAX_FILE_SIZE = 1024 * 150;
    // static DEFAULT_ALLOWED_FILE_TYPES = [
    //     'video/x-flv',
    //     'video/mp4',
    //     'application/x-mpegURL',
    //     'video/MP2T',
    //     'video/3gpp',
    //     'video/quicktime',
    //     'video/x-msvideo',
    //     'video/x-ms-wmv'
    // ];
//
    // static propTypes = {
    //     maxFiles: PropTypes.number,
    //     maxFileSize: PropTypes.number,
    //     allowedFileTypes: PropTypes.arrayOf(PropTypes.string)
    // };
    //
    // static defaultProps = {
    //     maxFiles: 0,//Upload.DEFAULT_MAX_FILES,
    //     maxFileSize: 0,//Upload.DEFAULT_MAX_FILE_SIZE,
    //     allowedFileTypes: []//Upload.DEFAULT_ALLOWED_FILE_TYPES
    // };

    static DEFAULT_STATE = {
        selectedFiles: null,
        loaded: 0,
        uploading: false
    };

    static contextTypes = {
        config: PropTypes.object
    };

    constructor(props, context) {
        super(props, context);

        this.state = { ...UploadPage.DEFAULT_STATE };
    }

    checkMaxFiles = event => {

        const { config } = this.context;
        //const { maxFiles } = this.props;
        const maxFiles = get(config, 'app.videoUpload.maxFiles', 0);
        const files = event.target.files;
        let result = true;

        if (maxFiles && files.length > maxFiles) {
            const message = `Only ${maxFiles} files can be uploaded at a time`;
            event.target.value = null;
            result = false;
            //console.log(message);
            toast.error(`Error: ${message}`)
        }

        return result;
    };

    // checkMimeTypes = event => {
    //
    //     const { config } = this.context;
    //     //const { allowedFileTypes } = this.props;
    //     const allowedFileTypes = get(config, 'app.videoUpload.allowedFileTypes', []);
    //     const files = event.target.files;
    //     const len = files.length;
    //     let result = true;
    //     let message = '';
    //
    //     if (allowedFileTypes.length) {
    //
    //         for (let i = 0; i < len; i++) {
    //             if (allowedFileTypes.every(type => files[i].type !== type)) {
    //                 //message += `${files[i].type} is not a supported format\n`;
    //                 toast.error(`${files[i].name} is in an unsupported format (${files[i].type})`);
    //                 result = false;
    //             }
    //         }
    //
    //         if (!result) {
    //             event.target.value = null;
    //         }
    //
    //         // if (message !== '') {
    //         //     event.target.value = null;
    //         //     result = false;
    //         //     console.log(message);
    //         // }
    //     }
    //
    //     return result;
    // };
    //
    // checkFileSizes = event => {
    //
    //     const { config } = this.context;
    //     //const { maxFileSize } = this.props;
    //     const maxFileSize = get(config, 'app.videoUpload.maxFileSize', 0);
    //     const files = event.target.files;
    //     const len = files.length;
    //     const limit = formatFileSize(maxFileSize);
    //     let message = '';
    //     let result = true;
    //
    //     if (maxFileSize) {
    //         for (let i = 0; i < len; i ++) {
    //
    //             if (files[i].size > maxFileSize) {
    //                 //message += `${files[i].type} is too large, please select a smaller file\n`;
    //                 toast.error(`${files[i].name} is too large (limit ${limit}), please select a smaller file`);
    //                 result = false;
    //             }
    //         }
    //
    //         if (!result) {
    //             event.target.value = null;
    //         }
    //
    //         // if (message !== '') {
    //         //     event.target.value = null;
    //         //     result = false;
    //         //     console.log(message);
    //         // }
    //     }
    //
    //     return result;
    // };
    //
    // checkTotalFileSize = event => {
    //
    // };

    checkMimeType(file) {
        const { config } = this.context;
        const allowedFileTypes = get(config, 'app.videoUpload.allowedFileTypes', []);
        let result = true;

        if (allowedFileTypes.length && allowedFileTypes.indexOf(file.type) === -1) {
            toast.error(`${file.name} is in an unsupported format (${file.type})`);
            result = false;
        }

        return result;

    }

    checkFileSize(file) {
        const { config } = this.context;
        const maxFileSize = get(config, 'app.videoUpload.maxFileSize', 0);
        let result = true;

        if (maxFileSize && file.size > maxFileSize) {
            toast.error(`${file.name} is too large (limit ${formatFileSize(maxFileSize)}), please select a smaller file`);
            result = false;
        }

        return result;
    }

    validateFiles = event => {
        //return this.checkMaxFiles(event) && this.checkMimeTypes(event) && this.checkFileSizes(event);
        const { config } = this.context;
        const maxTotalFileSize = get(config, 'app.videoUpload.maxTotalFileSize', 0);
        let result = false;

        if (this.checkMaxFiles(event)) {
            const files = Array.from(event.target.files);
            let totalSize = 0;
            const verified = files.every(file => {
                totalSize += file.size;
                return this.checkMimeType(file) && this.checkFileSize(file);
            });

            if (maxTotalFileSize && totalSize > maxTotalFileSize) {
                toast.error(`Error: Total file size exceeds limit of ${formatFileSize(maxTotalFileSize)}`);
            } else {
                result = verified;
            }
        }

        return result;
    };

    onChange = event => {

        const state = { ...UploadPage.DEFAULT_STATE };

        // if (this.validateFiles(event)) {
        //     this.setState({
        //         selectedFiles: event.target.files,
        //         loaded: 0
        //     });
        // }

        if (this.validateFiles(event)) {
            state.selectedFiles = event.target.files;
        } else {
            event.target.value = null;
        }

        this.setState(state);
    };

    onSubmit = async event => {
        const { config } = this.context;
        const { selectedFiles } = this.state;
        const data = new FormData();

        event.preventDefault();

        if (!selectedFiles) {
            toast.error('Error: No files selected');
            return;
        }

        const len = selectedFiles.length;

        for (let i = 0; i < len; i++) {
            data.append('file', selectedFiles[i]);
        }

        try {
            this.setState({uploading: true});
            const result = await axios.post(config.app.endpoints.api.video.upload, data, {
                onUploadProgress: ProgressEvent => {
                    this.setState({loaded: (ProgressEvent.loaded / ProgressEvent.total * 100)});
                }
            });

            toast.success('Upload complete');
            //this.setState({ ...UploadPage.DEFAULT_STATE });

        } catch (err) {
            toast.error(`Error: ${err.message}`);
        } finally {
            this.setState({uploading: false});
        }
    };

    render() {
        const { config } = this.context;
        const { loaded, selectedFiles, uploading } = this.state;
        // const classes = useStyles();
        const maxFiles = get(config, 'app.videoUpload.maxFiles', 0);
        const maxFileSize = formatFileSize(get(config, 'app.videoUpload.maxFileSize', 0));
        const maxTotalFileSize = formatFileSize(get(config, 'app.videoUpload.maxTotalFileSize', 0));
        const allowedFileTypes = get(config, 'app.videoUpload.allowedFileTypes', []);
        const info = [
            {title: 'Allowed file types:', text: allowedFileTypes.join(', ')},
            {title: 'Maximum file size:', text: maxFileSize},
            {title: 'Maximum total file size:', text: maxTotalFileSize},
            {title: 'Maximum files:', text: maxFiles},
        ];
        const selectButtonAttributes = {
            variant: 'contained',
            component: 'label',
            color: 'primary',
        };
        const submitButtonAttributes = {
            variant: 'contained',
            component: 'button',
            type: 'submit',
            //className: classes.button
        };

        const files = !selectedFiles ?
            <span>No files selected</span> :
            <ul className="files">{Array.from(selectedFiles).map((item, index) => {
                const key = `file-${index}`;
                return (
                    <li key={key} className="file">
                        <span className="file-index">{index + 1}.</span>
                        <span className="file-name">{item.name}</span>
                        <span className="file-size">{formatFileSize(item.size)}</span>
                    </li>
                );
        })}</ul>;

        if (!selectedFiles || uploading) {
            submitButtonAttributes.disabled = true;
        }

        if (uploading) {
            selectButtonAttributes.disabled = true;
        }

        // TODO: change this
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        axios.defaults.headers.post['X-XSRF-TOKEN'] = token;

        return (
            <div className="page-upload">
                <h2>Upload</h2>
                <section className="content">
                    <InfoTable items={info} />
                    <form className="form form-upload" action={config.app.endpoints.api.video.upload} method="post" onSubmit={this.onSubmit}>
                        <input type="hidden" name="_csrf" value={token} />
                        <div className="form-fields">
                            <div className="form-field">
                                {/*<Button variant="contained" component="label" color="primary" className={classes.button}>*/}
                                <Button { ...selectButtonAttributes }>
                                    Select Files
                                    {/*<AddIcon className={classes.rightIcon} />*/}
                                    <AddIcon className="button-icon-right" />
                                    <input style={{display: 'none'}} type="file" name="file" multiple onChange={this.onChange} />
                                </Button>
                                {/*<label className="form-field--container">
                                    <span className="form-field--title">File:</span>
                                    <input className="form-field--value" type="file" name="file" multiple onChange={this.onChange} required />
                                </label>*/}
                            </div>
                        </div>
                        <div className="form-controls">
                            {/*<button type="submit">Upload</button>*/}
                            <Button { ...submitButtonAttributes }>
                                Upload
                                {/*<CloudUploadIcon className={classes.rightIcon} />*/}
                                <CloudUploadIcon className="button-icon-right" />
                            </Button>
                        </div>
                    </form>
                    <div className="status">
                        <div className="status-files">{files}</div>
                        <LinearProgress className="status-progress" variant="determinate" value={loaded} />
                    </div>
                </section>
            </div>
        );
    }
}

export default UploadPage;
