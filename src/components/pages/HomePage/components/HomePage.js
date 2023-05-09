import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import isEqual from 'lodash.isequal';
import { ConfigContext } from '../../../../context/Config';
import { Teaser, TeaserList } from '../../../index';
import { routePaths } from '../../../../routes';
import { isArrayEmpty } from '../../../../common';
import '../styles/home-page.scss';

class HomePage extends Component {
    static displayName = 'HomePage';

    static contextType = ConfigContext;

    static propTypes = {
        videos: PropTypes.arrayOf(PropTypes.object),
        videosDownloadError: PropTypes.string,
    };

    static defaultProps = {
        videos: null,
        videosDownloadError: null,
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState) || !isEqual(this.context, nextContext);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { videosDownloadError } = this.props;

        if (videosDownloadError) {
            toast.error(videosDownloadError);
        }
    }

    renderItems() {
        const { videos } = this.props;
        const videoPath = this.context.config.get('videoUpload.publicPath');

        if (!Array.isArray(videos) || isArrayEmpty(videos)) {
            return null;
        }

        return videos.map((item, index) => (
            <li key={ item.video }>
                <Link to={ routePaths.videoPlayerPage.replace(':id', index) }>
                    <Teaser
                        imageSrc={ `${videoPath}/${item.thumb}` }
                        animatedImageSrc={ `${videoPath}/${item.animatedThumb}` }
                        imageAlt={ `${item.video} thumbnail` }
                    />
                </Link>
            </li>
        ));
    }

    renderTitle() {
        const { videos } = this.props;

        if (Array.isArray(videos) && videos.length) {
            return <h2>{`Current Videos (${videos.length})`}</h2>;
        }

        return null;
    }

    renderContent() {
        const { videos } = this.props;

        if (!Array.isArray(videos)) {
            return <div className="centered">Acquiring video list...</div>;
        }

        if (!isArrayEmpty(videos)) {
            return <TeaserList className="videos">{this.renderItems()}</TeaserList>;
        }

        return <div className="centered">No videos found. Please upload a video to begin.</div>;
    }

    render() {
        return (
            <div className="page-home">
                {this.renderTitle()}

                <section className="content">
                    {this.renderContent()}
                </section>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { loadVideosReducer: reducer } = state;
    const { videos, videosDownloadError } = reducer;

    return {
        videos,
        videosDownloadError,
    };
};

const ConnectedHomePage = connect(mapStateToProps)(HomePage);

export const DisconnectedHomePage = HomePage;
export default ConnectedHomePage;
