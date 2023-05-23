import React from 'react';
// import mount from '../../helpers/mount';
import videosMock from '../../../../../tests/unit/__mocks__/videosMock';
// import ActionTypes from '../../../../constants/loadVideos';
import HomePage from '../components/HomePage';

describe(`Making sure the HomePage renders correctly`, () => {
    it(`Renders the HomePage component`, () => {
    //     const { wrapper, store } = mount(<HomePage />);
    //     const component = wrapper.find(DisconnectedHomePage);
    //
    //     expect(component.instance().props.videos).toEqual(null);
    //     expect(wrapper.find('h2').length).toEqual(0);
    //     expect(wrapper.find('.teaserlist').length).toEqual(0);
    //     expect(component.text()).toContain('Acquiring video list');
    //
    //     store.dispatch({ type: ActionTypes.LOAD_VIDEOS_SUCCESS, payload: videosMock });
    //     wrapper.update();
    //
    //     expect(component.instance().props.videos.length).toEqual(1);
    //     expect(wrapper.find('h2').length).toEqual(1);
    //     expect(wrapper.find('.teaserlist').length).toEqual(1);
    //     expect(wrapper.find('.teaserlist li').length).toEqual(1);
    //
    //     store.dispatch({ type: ActionTypes.LOAD_VIDEOS_SUCCESS, payload: [] });
    //     wrapper.update();
    //
    //     expect(component.instance().props.videos.length).toEqual(0);
    //     expect(wrapper.find('h2').length).toEqual(0);
    //     expect(wrapper.find('.teaserlist').length).toEqual(0);
    //     expect(component.text()).toContain('No videos found');
    });
});
