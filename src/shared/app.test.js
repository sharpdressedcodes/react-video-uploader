import React from 'react';
import mount from '../helpers/mount';
import App, { DisconnectedApp } from '../../../src/js/shared/app';

describe(`Making sure the app renders correctly`, () => {

    it(`Renders the App component`, () => {

        const { wrapper } = mount(<App data={[]}/>);
        const component = wrapper.find(DisconnectedApp);

        expect(component.find('h1').length).toEqual(1);
        expect(component.find('.page').length).toEqual(1);

    });

});
