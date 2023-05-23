import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ConfigContext, ToastContext } from '../../../../context';
import { findItemByUuid, isObjectEmpty } from '../../../../common';
import VideoPlayer from '../../../VideoPlayer';
import { useDidUpdate } from '../../../../hooks';
import '../styles/video-player-page.scss';

const VideoPlayerPage = () => {
    const config = useContext(ConfigContext);
    const toast = useContext(ToastContext);
    const { id } = useParams();
    const { videoPlaybackError } = useSelector(({ videoReducer }) => videoReducer);
    const video = useSelector(({ loadVideosReducer: { videos } }) => (!videos ? {} : findItemByUuid(id, videos)));
    const hasVideo = video && !isObjectEmpty(video);

    const renderTitle = () => {
        if (hasVideo) {
            return <h2>Play Video</h2>;
        }

        return null;
    };
    const renderContent = () => {
        const publicPath = config.get('videoUpload.publicPath', 'data/uploads');

        if (!hasVideo) {
            return <div className="centered">Acquiring...</div>;
        }

        return <VideoPlayer src={ `/${publicPath}/${video.video}` } poster={ `/${publicPath}/${video.poster}` } autoPlay controls />;
    };

    useDidUpdate(prevProps => {
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
