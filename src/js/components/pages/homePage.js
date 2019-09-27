import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';
import {Link} from "react-router-dom";

class HomePage extends Component {
    static displayName= 'Home';

    static contextTypes = {
        config: PropTypes.object
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            files: [],
            downloading: false,
        };
    }

    componentDidMount = async() => {
        await this.getVideos();
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const { files, downloading } = this.state;
        const filesChanged = files !== nextState.files;
        const downloadingChanged = downloading !== nextState.downloading;

        return filesChanged || downloadingChanged;
    }

    getVideos = async() => {

        const { config } = this.context;
        let response = null;

        try {
            this.setState({ downloading: true });
            response = await axios.get(config.app.endpoints.api.video.list);
            this.setState({ files: response.data.items, downloading: false });
        } catch (err) {
            toast.error(`Error: ${err.message}`);
            this.setState({ downloading: false });
        }

    };

    renderItems() {
        return this.state.files.map((item, index) => {
            const key = `item-${index}`;
            return (
                <li key={key}>
                    <Link to={`/video/${index}`}>
                        <img src={`data/uploads/${item.thumb}`} alt={`${item.video} thumbnail`} />
                    </Link>
                </li>
            );
        });
    }

    render() {
        const items = this.renderItems();
        let el = null;
        let title = null;

        if (this.state.downloading) {

            el = <div className="centered">Acquiring video list...</div>;

        } else if (items.length) {

            title = <h2>{`Current Videos (${items.length})`}</h2>;
            el = <ul className="videos">{items}</ul>;

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

export default HomePage;
