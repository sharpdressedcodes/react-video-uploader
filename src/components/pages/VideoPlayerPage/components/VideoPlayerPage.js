import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ConfigContext } from '../../../../context/Config';
import { isObjectEmpty } from '../../../../common';
import { VideoPlayer } from '../../../index';
import '../styles/video-player-page.scss';

class VideoPlayerPage extends Component {
    static displayName = 'VideoPlayerPage';

    static contextType = ConfigContext;

    static propTypes = {
        // history: PropTypes.object.isRequired,
        // location: PropTypes.object.isRequired,
        // match: PropTypes.object.isRequired,
        // eslint-disable-next-line react/no-unused-prop-types
        id: PropTypes.string.isRequired,
        videoPlaybackError: PropTypes.string,
        video: PropTypes.object,
    };

    static defaultProps = {
        videoPlaybackError: null,
        video: {},
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState) || !isEqual(this.context, nextContext);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { videoPlaybackError } = this.props;

        if (videoPlaybackError) {
            toast.error(videoPlaybackError);
        }
    }

    renderTitle() {
        const { video } = this.props;

        if (video && !isObjectEmpty(video)) {
            return <h2>Play Video</h2>;
        }

        return null;
    }

    renderContent() {
        const { video } = this.props;
        const publicPath = this.context.config.get('videoUpload.publicPath', 'data/uploads');

        if (!video || isObjectEmpty(video)) {
            return <div className="centered">Acquiring...</div>;
        }

        return <VideoPlayer src={ `/${publicPath}/${video.video}` } poster={ `/${publicPath}/${video.poster}` } autoPlay controls />;
    }

    render() {
        return (
            <div className="page-video-player">
                {this.renderTitle()}

                <section className="content">
                    {this.renderContent()}
                </section>
            </div>
        );
    }
}

const mapStateToProps = () => (state, ownProps) => ({
    videoPlaybackError: state.videoReducer.videoPlaybackError,
    // video: !state.loadVideosReducer.videos ? {} : state.loadVideosReducer.videos[ownProps.match.params.id]
    video: !state.loadVideosReducer.videos ? {} : state.loadVideosReducer.videos[ownProps.id],
});

export const ConnectedVideoPlayerPage = connect(mapStateToProps)(VideoPlayerPage);
export const DisconnectedVideoPlayerPage = VideoPlayerPage;

// Using a wrapper because react router only exposes useParams now as a way to obtain url params.
const VideoPlayerPageWrapper = () => {
    const { id } = useParams();

    return <ConnectedVideoPlayerPage id={ id } />;
};

export default VideoPlayerPageWrapper;
