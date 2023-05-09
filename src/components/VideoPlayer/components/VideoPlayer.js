import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import { connect } from 'react-redux';
import { videoPlaybackError } from '../../../actions/video';
// import PlayIcon from '@material-ui/icons/PlayCircleFilled';
// import PauseIcon from '@material-ui/icons/PauseCircleFilled';
// import IconButton from '@material-ui/core/IconButton';

class VideoPlayer extends Component {
    static displayName = 'VideoPlayer';

    static propTypes = {
        src: PropTypes.string.isRequired,
        poster: PropTypes.string,
        autoPlay: PropTypes.bool,
        controls: PropTypes.bool,
        actions: PropTypes.object,
    };

    static defaultProps = {
        poster: '',
        autoPlay: false,
        controls: false,
        actions: {},
    };

    constructor(...args) {
        super(...args);

        const [props] = args;

        this.container = createRef();
        this.video = createRef();
        this.state = { playing: props.autoPlay };
    }

    componentDidMount() {
        this.video.current.addEventListener('ended', this.onStop, false);
        this.video.current.addEventListener('error', this.onError, false);
        this.video.current.addEventListener('play', this.onPlay, false);
        this.video.current.addEventListener('pause', this.onPause, false);
        // this.container.current.addEventListener('click', this.onClick, false);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState) || !isEqual(this.context, nextContext);
    }

    componentWillUnmount() {
        this.video.current.removeEventListener('ended', this.onStop);
        this.video.current.removeEventListener('error', this.onError);
        this.video.current.removeEventListener('play', this.onPlay);
        this.video.current.removeEventListener('pause', this.onPause);
        // this.container.current.removeEventListener('click', this.onClick);

        this.pause();
    }

    onPause = event => {
        this.setState({ playing: false });
    };

    onPlay = event => {
        this.setState({ playing: true });
    };

    onStop = event => {
        this.setState({ playing: false });
    };

    onError = event => {
        const { actions, src } = this.props;
        const message = event.target.error.message;

        if (this.state.playing) {
            this.setState({ playing: false });
            actions.videoPlaybackError({ error: message });
        } else {
            actions.videoPlaybackError({ error: `Error loading ${src}\n${message}` });
        }
    };

    // onClick = async event => {
    //     if (this.state.playing) {
    //         this.pause();
    //     } else {
    //         await this.play();
    //     }
    // };

    // eslint-disable-next-line react/no-unused-class-component-methods
    play = async () => {
        try {
            await this.video.current.play();
            this.setState({ playing: true });
        } catch (err) {
            this.props.actions.videoPlaybackError({ error: err.message });
        }
    };

    pause = () => {
        this.setState({ playing: false });
        this.video.current.pause();
    };

    render() {
        const { src, poster, autoPlay, controls } = this.props;
        // const { playing } = this.state;
        const videoAttributes = {
            src,
            poster,
            ref: this.video,
            preload: 'none',
            controls,
            autoPlay,
        };
        const el = null;

        // if (!playing) {
        //     el = (
        //         <IconButton aria-label="play">
        //             <PlayIcon />
        //         </IconButton>
        //     );
        // }

        // eslint-disable-next-line jsx-a11y/media-has-caption
        const video = <video { ...videoAttributes } />;

        return (
            <div ref={ this.container } className="video-container">
                {el}
                {video}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    actions: {
        videoPlaybackError: payload => dispatch(videoPlaybackError(payload.error)),
    },
});

const ConnectedVideoPlayer = connect(null, mapDispatchToProps)(VideoPlayer);

export const DisconnectedVideoPlayer = VideoPlayer;

export default ConnectedVideoPlayer;
