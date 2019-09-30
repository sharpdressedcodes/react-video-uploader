import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { DisconnectedUploadPage as UploadPage } from '../../../../src/js/components/pages/uploadPage';
import { shallowWithContext } from '../../helpers/context';
import '../../helpers/unhandledRejection';

configure({ adapter: new Adapter() });

describe(`Making sure the UploadPage renders correctly`, () => {

    it(`Renders the UploadPage component`, () => {

        let component = shallowWithContext(<UploadPage/>);
        expect(component.find('.page-upload').length).toEqual(1);
        expect(component.find('h2').length).toEqual(1);
        expect(component.find('.content').length).toEqual(1);
        expect(component.instance().props.uploadValidationErrors.length).toEqual(0);
        expect(component.instance().props.uploadError).toEqual(null);
        expect(component.instance().props.uploadResult).toEqual(null);

    });
});
