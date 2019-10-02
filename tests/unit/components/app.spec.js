import React from 'react';
//import renderer from 'react-test-renderer';
import mount from '../helpers/mount';
import App from '../../../src/js/shared/app';

describe(`Making sure the app renders correctly`, () => {

    it(`Renders the App component`, () => {

        let component = mount(<App data={[]}/>);

        expect(component.find('h1').length).toEqual(1);
        expect(component.find('.page').length).toEqual(1);

    });

});
