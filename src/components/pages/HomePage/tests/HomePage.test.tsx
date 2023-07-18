import React from 'react';
import mount, { act } from '../../../../../tests/unit/helpers/mount';
import videosMock from '../../../../../tests/unit/__mocks__/videosMock';
import { loadVideosSuccess } from '../../../../state/reducers/loadVideos';
import HomePage from '../components/HomePage';

const renderComponent = () => <HomePage />;

describe('HomePage component', () => {
    it('Renders the component', () => {
        mount(renderComponent());

        expect(document.querySelector('.page-home')).toBeTruthy();
    });

    it('Renders the component without data', () => {
        const { renderer } = mount(renderComponent());

        expect(renderer.queryByText('Current Videos')).toBeFalsy();
        expect(document.querySelector('h2')).toBeNull();
        expect(document.querySelector('.teaserlist')).toBeNull();
        expect(renderer.queryByText('Acquiring video list...')).toBeInTheDocument();
    });

    it('Renders the component with data', () => {
        const { renderer, store } = mount(renderComponent());

        act(() => {
            store.dispatch(loadVideosSuccess(videosMock));
        });

        expect(document.querySelector('h2')).toBeTruthy();
        expect(document.querySelector('.teaserlist')).toBeTruthy();
        expect(document.querySelector('.teaserlist li')).toBeTruthy();
        expect(renderer.queryByText('Current Videos (1)')).toBeInTheDocument();

        act(() => {
            store.dispatch(loadVideosSuccess([]));
        });

        expect(renderer.queryByText('Current Videos')).toBeFalsy();
        expect(document.querySelector('h2')).toBeNull();
        expect(document.querySelector('.teaserlist')).toBeNull();
        expect(renderer.queryByText('No videos found. Please upload a video to begin.')).toBeInTheDocument();
    });
});
