import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Video from '../video';
import axios from 'axios';
import { toast } from 'react-toastify';

class VideoPage extends Component {
    static displayName = 'VideoPage';

    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired
    };

    static contextTypes = {
        config: PropTypes.object
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            file: null,
            downloading: false,
        };
    }

    componentDidMount = async() => {
        await this.getVideo();
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const { file, downloading } = this.state;
        const fileChanged = file !== nextState.file;
        const downloadingChanged = downloading !== nextState.downloading;

        return fileChanged || downloadingChanged;
    }

    getVideo = async() => {

        const { config } = this.context;
        let response = null;

        try {
            this.setState({ downloading: true });
            response = await axios.get(`${config.app.endpoints.api.video.get}/${this.props.match.params.id}`);
            this.setState({ file: response.data.item, downloading: false });
        } catch (err) {
            toast.error(`Error: ${err.message}`);
            this.setState({ downloading: false });
        }

    };

    render() {
        const { file, downloading } = this.state;
        let el = null;
        let title = null;

        if (downloading) {
            el = <div className="centered">Downloading...</div>;
        } else if (file) {
            title = <h2>Play Video</h2>;
            el = <Video src={`/data/uploads/${file.video}`} poster={`/data/uploads/${file.poster}`} autoPlay={true} />;
        } else {
            el = <div className="centered">Error</div>;
        }

        return (
            <div className="page-video">
                {title}
                <section className="content">
                    {el}
                </section>
            </div>
        );
    }
}

export default VideoPage;
