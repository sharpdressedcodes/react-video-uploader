import React from 'react';
//import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../../../src/js/components/app';
import { shallowWithContext } from '../helpers/context';
import '../helpers/unhandledRejection';

configure({ adapter: new Adapter() });

describe(`Making sure the app renders correctly`, () => {

    it(`Renders the App component`, () => {

        let component = shallowWithContext(<App/>);

        expect(component.find('h1').length).toEqual(1);
        expect(component.find('.page').length).toEqual(1);

    });

});
