import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import get from "lodash/get";

class FileUploader extends Component {
    static displayName = 'FileUploader';

    static contextTypes = {
        config: PropTypes.object
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            selectedFiles: null,
            loaded: 0
        };
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
            console.log(message);
        }

        return result;
    };

    checkMimeTypes = event => {

        const { config } = this.context;
        //const { allowedFileTypes } = this.props;
        const allowedFileTypes = get(config, 'app.videoUpload.allowedFileTypes', []);
        const files = event.target.files;
        const len = files.length;
        let result = true;
        let message = '';

        if (allowedFileTypes.length) {

            for (let i = 0; i < len; i++) {
                if (allowedFileTypes.every(type => files[i].type !== type)) {
                    message += `${files[i].type} is not a supported format\n`;
                }
            }

            if (message !== '') {
                event.target.value = null;
                result = false;
                console.log(message);
            }
        }

        return result;
    };

    checkFileSizes = event => {

        const { config } = this.context;
        //const { maxFileSize } = this.props;
        const maxFileSize = get(config, 'app.videoUpload.maxFileSize', 0);
        const files = event.target.files;
        const len = files.length;
        let message = '';
        let result = true;

        if (maxFileSize) {
            for (let i = 0; i < len; i ++) {
                if (files[i].size > maxFileSize) {
                    message += `${files[i].type} is too large, please select a smaller file\n`;
                }
            }

            if (message !== '') {
                event.target.value = null;
                result = false;
                console.log(message);
            }
        }

        return result;
    };

    validateFiles = event => {
        return this.checkMaxFiles(event) && this.checkMimeTypes(event) && this.checkFileSizes(event);
    };

    onChange = event => {

        if (this.validateFiles(event)) {
            this.setState({
                selectedFiles: event.target.files,
                loaded: 0
            });
        }
    };

    render() {
        const { loaded } = this.state;

        return (
            <div>
                <input type="file" name="file" multiple onChange={this.onChange} required />
                <LinearProgress variant="determinate" value={loaded} />
            </div>
        );
    }
}

export default FileUploader;
