import React from 'react';
import { IndexRoute, Route, Switch } from 'react-router';
import App from './app';
import HomePage from './pages/homePage';
import UploadPage from './pages/uploadPage';
import VideoPage from './pages/videoPage';

const routes = (
    <Switch>
        <Route name="app" path="/" render={props => <App {...props} />}>
            <Route name="upload" path="upload" render={props => <UploadPage {...props} />}/>
            <Route name="video" path="video/:id(\d+)" render={props => <VideoPage {...props} />}/>
            <IndexRoute name="home" render={props => <HomePage {...props} />}/>
        </Route>
    </Switch>
);

export default routes;
