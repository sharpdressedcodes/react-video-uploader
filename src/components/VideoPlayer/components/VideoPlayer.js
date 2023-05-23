import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { videoPlaybackError } from '../../../actions/video';
// import PlayIcon from '@mui/icons-material/PlayCircleFilled';
// import PauseIcon from '@mui/icons-material/PauseCircleFilled';
// import IconButton from '@mui/icons-material/IconButton';

const VideoPlayer = ({ autoPlay, className, controls, poster, src }) => {
    const [playing, setPlaying] = useState(autoPlay);
    const ref = useRef(null);
    const dispatch = useDispatch();

    const onPause = event => {
        setPlaying(false);
    };
    const onPlay = event => {
        setPlaying(true);
    };
    const onStop = event => {
        setPlaying(false);
    };
    const onError = event => {
        const { message } = event.target.error;

        if (playing) {
            setPlaying(false);
            dispatch(videoPlaybackError(message));
        } else {
            dispatch(videoPlaybackError(`Error loading ${src}\n${message}`));
        }
    };
    const play = async () => {
        try {
            await ref.current.play();
            setPlaying(true);
        } catch (err) {
            dispatch(videoPlaybackError(err.message));
        }
    };
    const pause = () => {
        setPlaying(false);
        ref.current.pause();
    };

    useEffect(() => () => {
        if (ref.current) {
            pause();
        }
    }, [autoPlay, className, controls, poster, src]);

    return (
        <div className={ classNames('video-container', className) }>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
                autoPlay={ autoPlay }
                controls={ controls }
                onEnded={ onStop }
                onError={ onError }
                onPlay={ onPlay }
                onPause={ onPause }
                poster={ poster }
                preload="none"
                ref={ ref }
                src={ src }
            />
        </div>
    );
};

VideoPlayer.displayName = 'VideoPlayer';

VideoPlayer.propTypes = {
    src: PropTypes.string.isRequired,
    autoPlay: PropTypes.bool,
    className: PropTypes.string,
    controls: PropTypes.bool,
    poster: PropTypes.string,
};

VideoPlayer.defaultProps = {
    autoPlay: false,
    className: null,
    controls: false,
    poster: '',
};

export default memo(VideoPlayer);
