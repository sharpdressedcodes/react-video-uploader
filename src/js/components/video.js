import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import PlayIcon from '@material-ui/icons/PlayCircleFilled';
import PauseIcon from '@material-ui/icons/PauseCircleFilled';
import IconButton from '@material-ui/core/IconButton';

class Video extends Component {
    static displayName = 'Video';

    static propTypes = {
        src: PropTypes.string.isRequired,
        poster: PropTypes.string,
        autoPlay: PropTypes.bool
    };

    static defaultProps = {
        poster: '',
        autoPlay: false
    };

    constructor(props, context) {
        super(props, context);

        this.container = React.createRef();
        this.video = React.createRef();
        this.state = {
            playing: false,
            paused: false,
        };
    }

    componentDidMount() {

        this.video.current.addEventListener('ended', this.onStop, false);
        this.video.current.addEventListener('error', this.onError, false);
        //this.container.current.addEventListener('click', this.onClick, false);
    }

    componentWillUnmount() {

        this.video.current.removeEventListener('ended', this.onStop);
        this.video.current.removeEventListener('error', this.onError);
        //this.container.current.removeEventListener('click', this.onClick);

        this.pause();
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {

    }

    onStop = event => {
        this.setState({ playing: false, paused: false });
    };

    onError = event => {

        if (this.state.playing) {
            toast.error(event.target.error.message);
            this.setState({ playing: false, paused: false });
        } else {
            toast.error(`Error loading ${this.props.src}\n${event.target.error.message}`);
        }

    };

    onClick = async event => {

        if (this.state.playing) {
            this.pause();
        } else {
            await this.play();
        }
    };

    play = async () => {
        try {
            await this.video.current.play();
            this.setState({ playing: true, paused: false });
        } catch (err) {
            toast.error(err.message);
        }

    };

    pause = () => {
        this.setState({ playing: false, paused: true });
        this.video.current.pause();
    };

    render() {
        const { src, poster, autoPlay } = this.props;
        const { playing, paused } = this.state;
        const videoAttributes = {
            src,
            poster,
            ref: this.video,
            preload: 'none',
            controls: true
        };
        const thumbAttributes = {
            src: poster,
            alt: `${src} thumbnail`
        };
        let el = null;

        if (autoPlay) {
            videoAttributes.autoPlay = true;
        }

        if (playing || paused) {
            thumbAttributes.className = 'hidden';
            //el = <PauseIcon fontSize="large" />;
            el = (
                <IconButton aria-label="pause">
                    <PauseIcon />
                </IconButton>
            );
        } else {
            //videoAttributes.style = hidden;
            //el = <PlayIcon fontSize="large" />;
            el = (
                <IconButton aria-label="play">
                    <PlayIcon />
                </IconButton>
            );
        }

        return (
            <Fragment>
                <div ref={this.container} className="video-container">
                    {null}
                    <video { ...videoAttributes } />
                    {/*<img { ...thumbAttributes } />*/}
                </div>
                {/*<div>
                    <button onClick={this.play}>Play</button>
                    <button onClick={this.pause}>Pause</button>
                </div>*/}
            </Fragment>

        );
    }
}

export default Video;
