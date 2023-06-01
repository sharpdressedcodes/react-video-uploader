import React from 'react';
// import mount from '../../../../tests/unit/helpers/mount';
// import config from 'react-global-configuration';
import filesMock from '../../../../tests/fixtures/filesMock';
import Uploader from '../components/Uploader';
import { testConfig } from '../../../config';
// Used to capture the callback for the progress event
let componentCallback = null;

const mockData = { test: 'test' };

function createXHRMock(data = mockData) {
    const status = 200;
    const readyState = 4;
    const responseText = data ? JSON.stringify(data) : data;
    const open = jest.fn();
    const send = jest.fn();
    const setRequestHeader = jest.fn();
    const upload = {
        addEventListener: (eventName, cb, useCapture) => {
            componentCallback = cb;
        },
    };
    const xhrMockClass = function xhrMock() {
        return {
            open,
            send,
            status,
            setRequestHeader,
            responseText,
            readyState,
            upload,
        };
    };

    window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);
}

describe('Ensure the Uploader works correctly', () => {
    const wrapper = null;
    const component = null;
    const store = null;
    const input = null;
    // let mockXHR = null;

    // beforeEach(() => {
    //     ({ wrapper, store } = mount(
    //         <Uploader
    //             url={ testConfig.get('endpoints.api.video.upload') }
    //             multiple
    //             progress
    //         />
    //     ));
    //     component = wrapper.find(DisconnectedUploader);
    //     input = component.find('input[type="file"]');
    // });

    it('Should render the Uploader component in default state', () => {
        // expect(component.find('.uploader').length).toEqual(1);
        // expect(component.find('.form-upload').length).toEqual(1);
        // expect(component.find('button[type="submit"]').length).toEqual(1);
        // expect(input.length).toEqual(1);
        // expect(component.text()).toContain('No files selected');
        // expect(component.find('.files').length).toEqual(0);
        // expect(component.instance().state).toEqual(Uploader.DEFAULT_STATE);
    });

    // it(`Should fail validation because there is no input`, () => {
    //     expect(input.length).toEqual(1);
    //     expect(component.text()).toContain('No files selected');
    //     expect(component.find('.files').length).toEqual(0);
    //     expect(component.instance().state).toEqual(Uploader.DEFAULT_STATE);
    //
    //     component.find('button[type="submit"]').simulate('click');
    //
    //     expect(component.text()).toContain('No files selected');
    //     expect(component.find('.files').length).toEqual(0);
    //     expect(component.instance().state).toEqual(Uploader.DEFAULT_STATE);
    // });
    //
    // it(`Should fail validation because the file is too large`, () => {
    //     expect(input.length).toEqual(1);
    //     expect(component.text()).toContain('No files selected');
    //     expect(component.find('.files').length).toEqual(0);
    //     expect(component.instance().state).toEqual(Uploader.DEFAULT_STATE);
    //
    //     input.simulate('change', {
    //         target: {
    //             files: filesMock.fileTooLarge
    //         }
    //     });
    //
    //     expect(component.text()).toContain('No files selected');
    //     expect(component.find('.files').length).toEqual(0);
    //     expect(component.instance().state).toEqual(Uploader.DEFAULT_STATE);
    // });
    //
    // it(`Should fail validation because the file has the wrong file extension`, () => {
    //     expect(input.length).toEqual(1);
    //     expect(component.text()).toContain('No files selected');
    //     expect(component.find('.files').length).toEqual(0);
    //     expect(component.instance().state).toEqual(Uploader.DEFAULT_STATE);
    //
    //     input.simulate('change', {
    //         target: {
    //             files: filesMock.fileWrongFileExtension
    //         }
    //     });
    //
    //     expect(component.text()).toContain('No files selected');
    //     expect(component.find('.files').length).toEqual(0);
    //     expect(component.instance().state).toEqual(Uploader.DEFAULT_STATE);
    // });
    //
    // it(`Should fail validation because the total size of files is too large`, () => {
    //     expect(input.length).toEqual(1);
    //     expect(component.text()).toContain('No files selected');
    //     expect(component.find('.files').length).toEqual(0);
    //     expect(component.instance().state).toEqual(Uploader.DEFAULT_STATE);
    //
    //     input.simulate('change', {
    //         target: {
    //             files: filesMock.filesTooLarge
    //         }
    //     });
    //
    //     expect(component.text()).toContain('No files selected');
    //     expect(component.find('.files').length).toEqual(0);
    //     expect(component.instance().state).toEqual(Uploader.DEFAULT_STATE);
    // });
    //
    // it(`Should fail validation because there are too many files`, () => {
    //     expect(input.length).toEqual(1);
    //     expect(component.text()).toContain('No files selected');
    //     expect(component.find('.files').length).toEqual(0);
    //     expect(component.instance().state).toEqual(Uploader.DEFAULT_STATE);
    //
    //     input.simulate('change', {
    //         target: {
    //             files: filesMock.tooManyFiles
    //         }
    //     });
    //
    //     expect(component.text()).toContain('No files selected');
    //     expect(component.find('.files').length).toEqual(0);
    //     expect(component.instance().state).toEqual(Uploader.DEFAULT_STATE);
    // });
    //
    // it(`Should pass validation`, () => {
    //     expect(input.length).toEqual(1);
    //     expect(component.text()).toContain('No files selected');
    //     expect(component.find('.files').length).toEqual(0);
    //     expect(component.instance().state).toEqual(Uploader.DEFAULT_STATE);
    //
    //     input.simulate('change', {
    //         target: {
    //             files: filesMock.pass
    //         }
    //     });
    //
    //     expect(component.text()).not.toContain('No files selected');
    //     expect(wrapper.find('.files').length).toEqual(1);
    //     expect(component.instance().state.selectedFiles).toEqual(filesMock.pass);
    //     expect(wrapper.find('.file-index').length).toEqual(1);
    //
    //     const name = wrapper.find('.file-name');
    //     const size = wrapper.find('.file-size');
    //
    //     expect(name.length).toEqual(1);
    //     expect(size.length).toEqual(1);
    //     expect(name.text()).toEqual(filesMock.pass[0].name);
    //     expect(size.text()).toEqual(`${filesMock.pass[0].size} B`);
    // });
    //
    // it(`Should successfully upload a file and report progress`, done => {
    //     input.simulate('change', {
    //         target: {
    //             files: filesMock.pass
    //         }
    //     });
    //
    //     // Check upload
    //     expect(component.instance().state.loaded).toEqual(0);
    //     expect(component.instance().state.uploading).toEqual(false);
    //     expect(componentCallback).toEqual(null);
    //
    //     // mockXHR = createXHRMock();
    //     createXHRMock();
    //
    //     const spy = jest.spyOn(component.instance(), 'onSubmit');
    //
    //     component.update();
    //     component.instance().forceUpdate();
    //
    //     component.find('button[type="submit"]').simulate('submit', {
    //         target: {
    //             value: component.find('button[type="submit"]')
    //         }
    //     });
    //
    //     expect(spy).toHaveBeenCalledTimes(1);
    //     // expect(component.instance().onSubmit).toHaveBeenCalledTimes(1);
    //     expect(component.instance().state.uploading).toEqual(true);
    //
    //     // Simulate progress event
    //     setTimeout(() => {
    //         expect(componentCallback).not.toEqual(null);
    //
    //         componentCallback({
    //             loaded: 4,
    //             total: 8
    //         });
    //
    //         expect(component.instance().state.loaded).toEqual(50);
    //
    //         componentCallback({
    //             loaded: 8,
    //             total: 8
    //         });
    //
    //         expect(component.instance().state.loaded).toEqual(100);
    //
    //         done();
    //     }, 0);
    // });
});
