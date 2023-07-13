import React from 'react';
import mount, {
    act,
    getElementByName,
    getElementByType,
    getSubmitButtonByText,
    fireEvent,
    screen,
    waitFor,
} from '../../../../../tests/unit/helpers/mount';
import UploadPage from '../components/UploadPage';
import { formatFileSize, isArrayEmpty } from '../../../../common';
import filesMock from '../../../../../tests/fixtures/filesMock';
import componentConfig from '../config';

type UploadProgressType = (event: Partial<ProgressEvent>) => void;
type UploadProgressParametersType = (eventName: string, callback: UploadProgressType, useCapture?: boolean) => void;

// Used to capture the callback for the progress event
let onProgress: Nullable<UploadProgressType> = null;
let xhr: any = null;

const submitButtonText = 'Upload';
const mockData: Record<string, string> = { test: 'test' };
const onAddEventListener: UploadProgressParametersType = (eventName, cb, useCapture) => {
    if (eventName === 'progress') {
        onProgress = cb;
    }
};
const buildProgressEventData = (loaded: number, total: number): Partial<ProgressEvent> => ({
    lengthComputable: true,
    loaded,
    total,
});
const createXHRMock = (data = mockData) => {
    const status = 200;
    const readyState = 4;
    const responseText = data ? JSON.stringify(data) : data;
    const open = jest.fn();
    const send = jest.fn();
    const setRequestHeader = jest.fn();
    const upload = { addEventListener: onAddEventListener };
    const xhrMockClass = function xhrMock() {
        xhr = {
            open,
            send,
            status,
            setRequestHeader,
            responseText,
            readyState,
            upload,
            onloadend: null,
        };

        return xhr;
    };

    window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);
};
const renderComponent = () => <UploadPage />;
const getSubmitButton = () => getSubmitButtonByText(submitButtonText);

describe('UploadPage component', () => {
    it('Should render the component in default state', () => {
        mount(renderComponent());

        expect(screen.getByRole('heading')).toHaveTextContent('Upload Videos');

        // const allowedFileExtensions = testConfig.allowedFileExtensions;
        // const maxFiles = testConfig.videoUpload.maxFiles;
        // const maxFileSize = testConfig.videoUpload.maxFileSize;
        // const maxTotalFileSize = testConfig.videoUpload.maxTotalFileSize;
        const allowedFileExtensions = componentConfig.file.rules!.allowedFileExtensions.value;
        const maxFiles = componentConfig.file.rules!.maxArrayLength.value;
        const maxFileSize = componentConfig.file.rules!.maxFileSize.value;
        const maxTotalFileSize = componentConfig.file.rules!.maxTotalFileSize.value;

        if (!isArrayEmpty(allowedFileExtensions)) {
            const extensions = allowedFileExtensions.join(', ');

            expect(screen.queryByText('Allowed file types')).toBeInTheDocument();
            expect(screen.queryByText(extensions)).toBeInTheDocument();
        }

        if (maxFiles) {
            expect(screen.queryByText('Maximum files')).toBeInTheDocument();
            expect(screen.queryByText(maxFiles.toString())).toBeInTheDocument();
        }

        if (maxFileSize) {
            expect(screen.queryByText('Maximum file size')).toBeInTheDocument();
            expect(screen.queryByText(formatFileSize(maxFileSize))).toBeInTheDocument();
        }

        if (maxTotalFileSize) {
            expect(screen.queryByText('Maximum files size')).toBeInTheDocument();
            expect(screen.queryByText(formatFileSize(maxTotalFileSize))).toBeInTheDocument();
        }

        expect(getSubmitButton()).toHaveAttribute('disabled');

        expect(screen.queryByText('No files selected')).toBeInTheDocument();
    });

    it('Should fail validation because there is no input', async () => {
        const { user } = mount(renderComponent());
        const submitButton = getSubmitButton();

        expect(screen.queryByText('No files selected')).toBeInTheDocument();

        // user.click throws an error because the submit button is disabled and not clickable
        // await user.click(submitButton);
        act(() => {
            fireEvent.click(submitButton as Element);
        });

        expect(submitButton).toHaveAttribute('disabled');
        expect(screen.queryByText('No files selected')).toBeInTheDocument();
    });

    it('Should fail validation because the file is too large', async () => {
        const { user } = mount(renderComponent());
        const submitButton = getSubmitButton();
        const fileInput = getElementByType('file');

        await user.upload(fileInput, filesMock.fileTooLarge);

        expect(submitButton).toHaveAttribute('disabled');
        expect(screen.queryByText('No files selected')).not.toBeInTheDocument();
        expect(screen.queryByText('Invalid')).toBeInTheDocument();
    });

    it('Should fail validation because the file has the wrong file extension', async () => {
        const { user } = mount(renderComponent());
        const submitButton = getSubmitButton();
        const fileInput = getElementByType('file');

        await user.upload(fileInput, filesMock.fileWrongFileExtension);

        expect(submitButton).toHaveAttribute('disabled');
        expect(screen.queryByText('No files selected')).toBeInTheDocument();
    });

    it('Should fail validation because the total size of files is too large', async () => {
        const { user } = mount(renderComponent());
        const submitButton = getSubmitButton();
        const fileInput = getElementByType('file');

        await user.upload(fileInput, filesMock.filesTooLarge);

        expect(submitButton).toHaveAttribute('disabled');
        expect(screen.queryByText('No files selected')).not.toBeInTheDocument();
        expect(screen.queryByText(filesMock.filesTooLarge[0].name)).toBeInTheDocument();
    });

    it('Should fail validation because there are too many files', async () => {
        const { user } = mount(renderComponent());
        const submitButton = getSubmitButton();
        const fileInput = getElementByType('file');

        await user.upload(fileInput, filesMock.tooManyFiles);

        expect(submitButton).toHaveAttribute('disabled');
        expect(screen.queryByText('No files selected')).not.toBeInTheDocument();
        expect(screen.queryByText(filesMock.tooManyFiles[0].name)).toBeInTheDocument();
    });

    it('Should pass validation', async () => {
        const { user } = mount(renderComponent());
        const submitButton = getSubmitButton();
        const fileInput = getElementByType('file');

        expect(submitButton).toHaveAttribute('disabled');

        await user.upload(fileInput, filesMock.pass);
        await waitFor(() => expect(submitButton).not.toHaveAttribute('disabled'));

        expect(screen.queryByText(filesMock.pass[0].name)).toBeInTheDocument();
        expect(screen.queryByText(formatFileSize(filesMock.pass[0].size))).toBeInTheDocument();
    });

    it('Should successfully upload a file and report progress', async () => {
        const { renderer, store, user } = mount(renderComponent());

        createXHRMock();

        const submitButton = getSubmitButton();
        const fileInput = getElementByType('file');

        await user.upload(fileInput, filesMock.pass);
        await waitFor(() => expect(submitButton).not.toHaveAttribute('disabled'));

        await user.click(submitButton);
        await waitFor(() => expect(onProgress).not.toBeNull());

        const itemProgressbar = document.querySelector('.status-progress');

        expect(itemProgressbar).not.toBeNull();
        expect(itemProgressbar?.getAttribute('aria-valuenow')).toEqual('0');

        act(() => {
            (onProgress as UploadProgressType)(buildProgressEventData(1, 2));
        });

        expect(renderer.queryByText('50%')).toBeInTheDocument();

        act(() => {
            (onProgress as UploadProgressType)(buildProgressEventData(2, 2));
        });

        expect(renderer.queryByText('100%')).toBeInTheDocument();

        expect(xhr.onloadend).not.toBeNull();
        xhr.onloadend(buildProgressEventData(2, 2));

        await waitFor(() => {
            const uploaderReducer = store.getState().uploaderReducer;

            return expect(uploaderReducer.result).toEqual(mockData);
        });
    });
});
