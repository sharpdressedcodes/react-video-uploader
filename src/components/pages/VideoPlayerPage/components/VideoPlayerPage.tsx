import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ConfigContext, ToastContext } from '../../../../context';
import { findItemByUuid, isObject, isObjectEmpty } from '../../../../common';
import VideoPlayer from '../../../VideoPlayer';
import useDidUpdate from '../../../../hooks/useDidUpdate';
import { useAppSelector } from '../../../../state/hooks';
import { LoadedVideoType } from '../../../../state/types';
import '../styles/video-player-page.scss';

type DependenciesType = {
    videoPlaybackError: string;
};

const VideoPlayerPage = () => {
    const config = useContext(ConfigContext);
    const toast = useContext(ToastContext);
    const { id } = useParams();
    const { videoPlaybackError } = useAppSelector(({ videoReducer }) => videoReducer);
    const video = useAppSelector(
        ({
            loadVideosReducer: { videos },
        }) => (!videos ? null : findItemByUuid<LoadedVideoType>(id as string, videos)),
    ) as LoadedVideoType;
    const hasVideo = Boolean(video) && isObject(video) && !isObjectEmpty(video);

    const renderTitle = () => {
        if (hasVideo) {
            return <h2>Play Video</h2>;
        }

        return null;
    };
    const renderContent = () => {
        const { publicPath } = config.videoUpload;

        if (!hasVideo) {
            return <div className="centered">Acquiring...</div>;
        }

        return <VideoPlayer src={ `/${publicPath}/${video.video}` } poster={ `/${publicPath}/${video.poster}` } autoPlay controls />;
    };

    useDidUpdate<DependenciesType>(prevProps => {
        if (videoPlaybackError && !prevProps.videoPlaybackError) {
            toast.error(videoPlaybackError);
        }
    }, [videoPlaybackError]);

    return (
        <div className="page-video-player">
            {renderTitle()}

            <section className="content">
                {renderContent()}
            </section>
        </div>
    );
};

VideoPlayerPage.displayName = 'VideoPlayerPage';

export default VideoPlayerPage;
