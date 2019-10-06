import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import config from 'react-global-configuration';
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
        const publicPath = config.get('app.videoUpload.publicPath', 'dist/uploads');
        let el = null;
        let title = null;

        if (!video || Object.keys(video).length === 0) {
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

const mapStateToProps = () => {
    return (state, ownProps) => {
        return {
            videoPlaybackError: state.videoReducer.videoPlaybackError,
            video: !state.loadVideosReducer.videos ? {} : state.loadVideosReducer.videos[ownProps.match.params.id]
        };
    };
};

const ConnectedVideoPage = connect(mapStateToProps)(VideoPage);
export const DisconnectedVideoPage = VideoPage;
export default ConnectedVideoPage;
