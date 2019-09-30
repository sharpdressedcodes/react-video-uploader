import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { DisconnectedVideoPage as VideoPage } from '../../../../src/js/components/pages/videoPage';
import videosMock from '../../__mocks__/videosMock';
import { shallowWithContext } from '../../helpers/context';
import '../../helpers/unhandledRejection';

configure({ adapter: new Adapter() });

const props = {
    history: {},
    location: {},
    match: {}
};

describe(`Making sure the VideoPage renders correctly`, () => {

    it(`Renders the VideoPage component`, () => {

        let component = shallowWithContext(<VideoPage { ...props } />);
        expect(component.find('.page-video').length).toEqual(1);
        expect(component.find('h2').length).toEqual(0);

        expect(component.find('.content').length).toEqual(1);
        expect(component.text()).toContain('Acquiring...');
        expect(component.instance().props.videoPlaybackError).toEqual(null);
        expect(Object.keys(component.instance().props.video).length).toEqual(0);

        component.setProps({video: videosMock[0]});

        expect(component.find('h2').length).toEqual(1);
        expect(component.text()).toContain('Play Video');

    });
});
