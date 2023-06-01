import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ConfigContext, ToastContext } from '../../../../context';
import Teaser from '../../../Teaser';
import TeaserList from '../../../TeaserList';
import { routePaths } from '../../../../routes';
import { isArrayEmpty } from '../../../../common';
import useDidUpdate from '../../../../hooks/useDidUpdate';
import { useAppSelector } from '../../../../state/hooks';
import '../styles/home-page.scss';

type DependenciesType = {
    videosDownloadError: string;
};

const HomePage = () => {
    const config = useContext(ConfigContext);
    const toast = useContext(ToastContext);
    const { videos, videosDownloadError } = useAppSelector(({ loadVideosReducer }) => loadVideosReducer);
    const hasVideos = Array.isArray(videos) && !isArrayEmpty(videos);
    const renderItems = () => {
        const videoPath = config.get('videoUpload.publicPath');

        if (!hasVideos) {
            return null;
        }

        return videos?.map(({ animatedThumb, thumb, uuid, video }) => (
            <li key={ video }>
                <Link to={ routePaths.videoPlayerPage.replace(':id', uuid) }>
                    <Teaser
                        imageSrc={ `${videoPath}/${thumb}` }
                        animatedImageSrc={ `${videoPath}/${animatedThumb}` }
                        imageAlt={ `${video} thumbnail` }
                    />
                </Link>
            </li>
        ));
    };
    const renderTitle = () => {
        if (hasVideos) {
            return <h2>{`Current Videos (${videos?.length})`}</h2>;
        }

        return null;
    };
    const renderContent = () => {
        if (!Array.isArray(videos)) {
            return <div className="centered">Acquiring video list...</div>;
        }

        if (!isArrayEmpty(videos)) {
            return <TeaserList className="videos">{renderItems()}</TeaserList>;
        }

        return <div className="centered">No videos found. Please upload a video to begin.</div>;
    };

    useDidUpdate<DependenciesType>(prevProps => {
        // if (videosDownloadError && !(prevProps as unknown as DepType).videosDownloadError) {
        if (videosDownloadError && !prevProps.videosDownloadError) {
            toast.error(videosDownloadError);
        }
    }, [videosDownloadError]);

    return (
        <div className="page-home">
            {renderTitle()}

            <section className="content">
                {renderContent()}
            </section>
        </div>
    );
};

HomePage.displayName = 'HomePage';

export default HomePage;
