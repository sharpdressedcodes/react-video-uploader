import React from 'react';
import mount from '../../../../../tests/unit/helpers/mount';
import UploadPage from '../components/UploadPage';

const renderComponent = () => <UploadPage />;

describe('UploadPage component', () => {
    it('Renders the component', () => {
        mount(renderComponent());

        expect(document.querySelector('.page-upload')).toBeTruthy();
        expect(document.querySelector('h2')).toBeTruthy();
        expect(document.querySelector('.content')).toBeTruthy();
    });
});
