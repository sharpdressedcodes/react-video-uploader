import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { connectToStores } from 'fluxible-addons-react';
import Video from '../video';

class VideoPage extends Component {
    static displayName = 'VideoPage';

    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        videoPlaybackError: PropTypes.string,
        video: PropTypes.object
    };

    static defaultProps = {
        videoPlaybackError: null,
        video: {}
    };

    static contextTypes = {
        config: PropTypes.object,
        getStore: PropTypes.func
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { videoPlaybackError } = this.props;

        if (videoPlaybackError) {
            toast.error(videoPlaybackError);
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const errorChanged = this.props.videoPlaybackError !== nextProps.videoPlaybackError;
        const videoChanged = this.props.video !== nextProps.video;

        return errorChanged || videoChanged;
    }

    render() {
        const { video } = this.props;
        const { config } = this.context;
        const { publicPath } = config.app.videoUpload;
        let el = null;
        let title = null;

        if (Object.keys(video).length === 0) {
            el = <div className="centered">Acquiring...</div>;
        } else {
            title = <h2>Play Video</h2>;
            el = <Video src={`/${publicPath}/${video.video}`} poster={`/${publicPath}/${video.poster}`} autoPlay controls />;
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

const ConnectedVideoPage = connectToStores(VideoPage, ['AppStore'], (context, props) => {
    const appStore = context.getStore('AppStore');
    const videoPlaybackError = appStore.getVideoPlaybackError();
    const video = appStore.getVideo(props.match.params.id);
    return {
        videoPlaybackError,
        video
    };
});

export const DisconnectedVideoPage = VideoPage;
export default ConnectedVideoPage;
