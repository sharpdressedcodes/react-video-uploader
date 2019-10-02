import React, { Component } from 'react';
import {ToastContainer} from 'react-toastify';
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
        Upload: '/upload',
    };

    render() {

        let data = null;

        if (__isBrowser__) {
            console.log('__INITIAL_DATA__', window.__INITIAL_DATA__);

            data = window.__INITIAL_DATA__;
        } else {
            console.log('staticContext', this.props.staticContext);
            data = this.props.staticContext;
        }

        if (data) {
            data = data.data || data;
            data = data.items || data;
            this.props.loadVideosSuccess({ videos: data });
        }

        return (
            <div>
                <ToastContainer />
                <h1>Video Uploader</h1>
                <Nav links={App.NAV_LINKS} />
                <section className="page">
                    <Switch>
                        {routes.map(({ path, exact, component: C, ...rest }) => (
                            <Route
                                key={path}
                                path={path}
                                exact={exact}
                                render={(props) => (
                                    <C {...props} {...rest} />
                                )}
                            />
                        ))}
                        <Route render={(props) => <NoMatch {...props} />} />
                    </Switch>
                </section>
            </div>

        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadVideosSuccess: payload => dispatch(loadVideosSuccess(payload.videos))
        // loadVideosError
    };
};

const ConnectedApp = connect(null, mapDispatchToProps)(App);
export const DisconnectedApp = App;
export default ConnectedApp;
