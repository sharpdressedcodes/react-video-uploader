import React, { memo, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { classNames } from '../../../common';
import { videoPlaybackError } from '../../../state/reducers/video';
import { useAppDispatch } from '../../../state/hooks';
import { DefaultPropsType, PropsType } from '../types';
// import PlayIcon from '@mui/icons-material/PlayCircleFilled';
// import PauseIcon from '@mui/icons-material/PauseCircleFilled';
// import IconButton from '@mui/icons-material/IconButton';

export const defaultProps: DefaultPropsType = {
    autoPlay: false,
    controls: false,
    poster: '',
};

const VideoPlayer = ({
    autoPlay = defaultProps.autoPlay,
    className,
    controls = defaultProps.controls,
    poster = defaultProps.poster,
    src,
}: PropsType) => {
    const [playing, setPlaying] = useState(autoPlay);
    const ref = useRef<HTMLVideoElement>(null);
    const dispatch = useAppDispatch();

    const onPause = (event: SyntheticEvent<HTMLVideoElement>) => {
        setPlaying(false);
    };
    const onPlay = (event: SyntheticEvent<HTMLVideoElement>) => {
        setPlaying(true);
    };
    const onStop = (event: SyntheticEvent<HTMLVideoElement>) => {
        setPlaying(false);
    };
    const onError = (event: SyntheticEvent<HTMLVideoElement>) => {
        const { message } = (event.target as HTMLVideoElement).error as MediaError;

        if (playing) {
            setPlaying(false);
            dispatch(videoPlaybackError(message));
        } else {
            dispatch(videoPlaybackError(`Error loading ${src}\n${message}`));
        }
    };
    const play = async () => {
        try {
            await ref.current?.play();
            setPlaying(true);
        } catch (err: unknown) {
            dispatch(videoPlaybackError((err as Error).message));
        }
    };
    const pause = () => {
        setPlaying(false);
        ref.current?.pause();
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

export default memo<PropsType>(VideoPlayer);
