import React from 'react';
import mount, { act } from '../../../../../tests/unit/helpers/mount';
import videosMock from '../../../../../tests/unit/__mocks__/videosMock';
import { loadVideosSuccess } from '../../../../state/reducers/loadVideos';
import VideoPlayerPage from '../components/VideoPlayerPage';
import routePaths from '../../../../routes/paths';

const renderComponent = () => <VideoPlayerPage />;
const testUrl = `${routePaths.videoPlayerPage.replace(':id', videosMock[0].uuid)}`;

window.HTMLMediaElement.prototype.pause = () => {};
window.HTMLMediaElement.prototype.play = () => Promise.resolve();

// Note: To test the actual video element events, use:
// videoElement.dispatchEvent(new window.Event("loading"));
describe('VideoPlayerPage component', () => {
    it('Renders the component', () => {
        mount(renderComponent());

        expect(document.querySelector('.page-video-player')).toBeTruthy();
    });

    it('Renders the component without state', () => {
        const { renderer } = mount(renderComponent());

        expect(document.querySelector('h2')).toBeNull();
        expect(renderer.queryByText('Acquiring...')).toBeInTheDocument();
    });

    it('Renders the component with state', () => {
        const { renderer, store } = mount(renderComponent(), {
            initialRouterEntries: [testUrl],
            routePath: routePaths.videoPlayerPage,
        });

        act(() => {
            store.dispatch(loadVideosSuccess(videosMock));
        });

        expect(document.querySelector('h2')).toBeTruthy();
        expect(renderer.queryByText('Acquiring...')).not.toBeInTheDocument();
        expect(renderer.queryByText('Play Video')).toBeInTheDocument();

        act(() => {
            store.dispatch(loadVideosSuccess([]));
        });

        expect(document.querySelector('h2')).toBeNull();
        expect(renderer.queryByText('Acquiring...')).toBeInTheDocument();
        expect(renderer.queryByText('Play Video')).not.toBeInTheDocument();
    });
});
