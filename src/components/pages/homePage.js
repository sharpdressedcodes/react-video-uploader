import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import config from '../../config';
import Teaser from '../teaser';
import TeaserList from '../teaserList';
import './homePage.scss';

class HomePage extends Component {
    static displayName= 'HomePage';

    static propTypes = {
        videos: PropTypes.arrayOf(PropTypes.object),
        videosDownloadError: PropTypes.string
    };

    static defaultProps = {
        videos: null,
        videosDownloadError: null
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { videosDownloadError } = this.props;

        if (videosDownloadError) {
            toast.error(videosDownloadError);
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const videosChanged = this.props.videos !== nextProps.videos;
        const videosDownloadErrorChanged = this.props.videosDownloadError !== nextProps.videosDownloadError;

        return videosChanged || videosDownloadErrorChanged;
    }

    renderItems() {
        const { videos } = this.props;
        const videoPath = config.get('app.videoUpload.publicPath');

        return !videos ? [] : videos.map((item, index) => {
            const key = `item-${index}`;
            return (
                <li key={key}>
                    <Link to={`/video/${index}`}>
                        <Teaser
                            imageSrc={`${videoPath}/${item.thumb}`}
                            animatedImageSrc={`${videoPath}/${item.animatedThumb}`}
                            imageAlt={`${item.video} thumbnail`}
                        />
                    </Link>
                </li>
            );
        });
    }

    render() {
        const items = this.renderItems();
        let el = null;
        let title = null;

        if (!this.props.videos) {
            el = <div className="centered">Acquiring video list...</div>;
        } else if (items.length) {
            title = <h2>{`Current Videos (${items.length})`}</h2>;
            el = <TeaserList className="videos">{items}</TeaserList>;
        } else {
            el = <div className="centered">No videos found. Please upload a video to begin.</div>;
        }

        return (
            <div className="page-home">
                {title}
                <section className="content">
                    {el}
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
        videosDownloadError
    };
};

const ConnectedHomePage = connect(mapStateToProps)(HomePage);
export const DisconnectedHomePage = HomePage;
export default ConnectedHomePage;
