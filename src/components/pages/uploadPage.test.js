import React from 'react';
import mount from '../../helpers/mount';
import UploadPage, { DisconnectedUploadPage } from '../../../../src/js/components/pages/uploadPage';

describe(`Making sure the UploadPage renders correctly`, () => {

    it(`Renders the UploadPage component`, () => {

        const { wrapper } = mount(<UploadPage/>);
        const component = wrapper.find(DisconnectedUploadPage);

        expect(component.find('.page-upload').length).toEqual(1);
        expect(component.find('h2').length).toEqual(1);
        expect(component.find('.content').length).toEqual(1);
        expect(component.instance().props.uploadValidationErrors.length).toEqual(0);
        expect(component.instance().props.uploadError).toEqual(null);
        expect(component.instance().props.uploadResult).toEqual(null);

    });
});
