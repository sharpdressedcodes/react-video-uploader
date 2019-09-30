import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { DisconnectedHomePage as HomePage } from '../../../../src/js/components/pages/homePage';
import videosMock from '../../__mocks__/videosMock';
import { shallowWithContext } from '../../helpers/context';
import '../../helpers/unhandledRejection';

configure({ adapter: new Adapter() });

describe(`Making sure the HomePage renders correctly`, () => {

    it(`Renders the HomePage component`, () => {

        let component = shallowWithContext(<HomePage/>);
        expect(component.instance().props.videos).toEqual(null);
        expect(component.find('h2').length).toEqual(0);
        expect(component.find('.videos').length).toEqual(0);

        component.setProps({videos: videosMock});

        expect(component.instance().props.videos.length).toEqual(1);
        expect(component.find('h2').length).toEqual(1);
        expect(component.find('.videos').length).toEqual(1);

        component.setProps({videos: []});

        expect(component.instance().props.videos.length).toEqual(0);
        expect(component.find('h2').length).toEqual(0);
        expect(component.find('.videos').length).toEqual(0);
        expect(component.text()).toContain('No videos found');


    });
});
