import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from './nav';
import HomePage from './pages/homePage';
import UploadPage from './pages/uploadPage';
import VideoPage from './pages/videoPage';

class App extends Component {
    static displayName = 'App';

    static NAV_LINKS = {
        Home: '/',
        Upload: '/upload',
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return false;
    }

    render() {
        return (
            <BrowserRouter>
                <ToastContainer />
                <h1>Video Uploader</h1>
                <Nav links={App.NAV_LINKS} />
                <section className="page">
                    <Switch>
                        <Route path="/" exact render={props => <HomePage {...props} />} />
                        <Route path="/upload" render={props => <UploadPage {...props} />} />
                        <Route path="/video/:id(\d+)" render={props => <VideoPage {...props} />} />
                    </Switch>
                </section>
            </BrowserRouter>
        );
    }
}

export default App;
