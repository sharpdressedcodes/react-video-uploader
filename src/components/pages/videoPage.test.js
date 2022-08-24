import React from 'react';
import VideoPage, { DisconnectedVideoPage } from '../../../../src/js/components/pages/videoPage';
import videosMock from '../../__mocks__/videosMock';
import mount from '../../helpers/mount';
import ActionTypes from "../../../../src/js/constants/loadVideos";

const props = {
    history: {},
    location: {},
    match: {
        params: {
            id: 0
        }
    }
};

describe(`Making sure the VideoPage renders correctly`, () => {

    it(`Renders the VideoPage component`, () => {

        const { wrapper, store } = mount(<VideoPage { ...props } />);
        const component = wrapper.find(DisconnectedVideoPage);

        expect(component.find('.page-video').length).toEqual(1);
        expect(wrapper.find('h2').length).toEqual(0);

        expect(component.find('.content').length).toEqual(1);
        expect(component.text()).toContain('Acquiring...');
        expect(component.instance().props.videoPlaybackError).toEqual(null);
        expect(Object.keys(component.instance().props.video).length).toEqual(0);

        store.dispatch({ type: ActionTypes.LOAD_VIDEOS_SUCCESS, payload: videosMock });
        wrapper.update();

        expect(wrapper.find('h2').length).toEqual(1);
        expect(component.text()).toContain('Play Video');

    });
});
