import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux';
import { Nav } from '../../index';
import { routes, navLinks } from '../../../routes';
import { loadVideosError, loadVideosSuccess } from '../../../actions/loadVideos';
import { ConfigProvider } from '../../../context/Config';
import '../styles/app.scss';

class App extends Component {
    static displayName = 'App';

    static propTypes = {
        actions: PropTypes.object,
        data: PropTypes.array.isRequired
    };

    static defaultProps = {
        actions: {}
    };

    componentDidMount() {
        document.body.style.opacity = 1;
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState) || !isEqual(this.context, nextContext);
    }

    render() {
        const { data, actions } = this.props;

        if (data) {
            actions.loadVideosSuccess({ videos: data });
        }

        return (
            <ConfigProvider>
                <ToastContainer />
                <h1>Video Uploader</h1>
                <Nav links={ navLinks } />

                <section className="page">
                    <Routes>
                        {routes.map(({ path, exact, element: Page, ...rest }) => (
                            <Route
                                key={ path }
                                path={ path }
                                exact={ Boolean(exact) }
                                element={ <Page { ...rest } /> }
                            />
                        ))}
                    </Routes>
                </section>
            </ConfigProvider>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    actions: {
        loadVideosSuccess: payload => dispatch(loadVideosSuccess(payload.videos))
        // loadVideosError
    }
});

const ConnectedApp = connect(null, mapDispatchToProps)(App);

export const DisconnectedApp = App;
export default ConnectedApp;
