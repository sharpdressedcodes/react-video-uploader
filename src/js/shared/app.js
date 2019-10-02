import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Nav from '../components/nav';
import routes from './routes';
import NoMatch from './noMatch';
import { loadVideosError, loadVideosSuccess } from '../actions/loadVideos';

class App extends Component {
    static displayName = 'App';

    static NAV_LINKS = {
        Home: '/',
        Upload: '/upload'
    };

    static propTypes = {
        actions: PropTypes.object,
        data: PropTypes.array.isRequired
    };

    static defaultProps = {
        actions: {}
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const dataChanged = this.props.data !== nextProps.data;

        return dataChanged;
    }

    render() {
        const { data, actions } = this.props;

        if (data) {
            actions.loadVideosSuccess({ videos: data });
        }

        return (
            <div>

                <ToastContainer />
                <h1>Video Uploader</h1>
                <Nav links={App.NAV_LINKS} />

                <section className="page">
                    <Switch>
                        {routes.map(({
                            path, exact, component: C, ...rest
                        }) => (
                            <Route
                                key={path}
                                path={path}
                                exact={exact}
                                render={props => (
                                    <C {...props} {...rest} />
                                )}
                            />
                        ))}
                        <Route render={props => <NoMatch {...props} />} />
                    </Switch>
                </section>

            </div>
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
