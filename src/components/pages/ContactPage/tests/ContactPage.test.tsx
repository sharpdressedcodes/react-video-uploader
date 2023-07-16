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
import ContactPage from '../components/ContactPage';
import { formatFileSize } from '../../../../common';
import fileFixtures from '../../../../../tests/unit/fixtures/files';
import componentConfig from '../config';

type UploadProgressType = (event: Partial<ProgressEvent>) => void;
type UploadProgressParametersType = (eventName: string, callback: UploadProgressType, useCapture?: boolean) => void;

// Used to capture the callback for the progress event
let onProgress: Nullable<UploadProgressType> = null;
let xhr: any = null;

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
const renderComponent = () => <ContactPage />;
const generateString = (size: number, character: string = ' ') => ''.padStart(size, character);
const submitButtonText = 'Send';
const shortEmail = 'abc';
const longEmail = `${generateString(65, 't')}@${generateString(320, 't')}.com`;
const invalidEmail = 'abc123xyz';
const validEmail = 'test@example.com';
const shortMessage = 'a';
const longMessage = generateString(2000);
const validMessage = 'test message';
const getSubmitButton = () => getSubmitButtonByText(submitButtonText);

// Note: Using user.paste instead of user.type because type takes too long, especially on longEmail.

describe('ContactPage component', () => {
    it('Should render the component in default state', () => {
        mount(renderComponent());

        expect(screen.getByRole('heading')).toHaveTextContent('Contact Us');

        const maxFiles = componentConfig.files.rules!.maxArrayLength.value;
        const maxFileSize = componentConfig.files.rules!.maxFileSize.value;
        const maxTotalFileSize = componentConfig.files.rules!.maxTotalFileSize.value;

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
    it('Should fail validation because email is too short', async () => {
        const { user } = mount(renderComponent());
        const submitButton = getSubmitButton();

        await user.paste(shortEmail);
        await user.tab();
        await user.paste(validMessage);

        expect(submitButton).toHaveAttribute('disabled');
    });
    it('Should fail validation because email is too long', async () => {
        const { user } = mount(renderComponent());
        const submitButton = getSubmitButton();
        const emailInput = getElementByName('email');

        emailInput.removeAttribute('maxlength');

        await user.paste(longEmail);
        await user.tab();
        await user.paste(validMessage);

        expect(submitButton).toHaveAttribute('disabled');
    });
    it('Should fail validation because email is in an invalid format', async () => {
        const { user } = mount(renderComponent());
        const submitButton = getSubmitButton();

        await user.paste(invalidEmail);
        await user.tab();
        await user.paste(validMessage);

        expect(submitButton).toHaveAttribute('disabled');
    });
    it('Should fail validation because message is too short', async () => {
        const { user } = mount(renderComponent());
        const submitButton = getSubmitButton();

        await user.paste(validEmail);
        await user.tab();
        await user.paste(shortMessage);

        expect(submitButton).toHaveAttribute('disabled');
    });
    it('Should fail validation because message is too long', async () => {
        const { user } = mount(renderComponent());
        const submitButton = getSubmitButton();
        const messageInput = getElementByName('message');

        messageInput.removeAttribute('maxlength');

        await user.paste(validEmail);
        await user.tab();
        await user.paste(longMessage);

        expect(submitButton).toHaveAttribute('disabled');
    });
    it('Should fail validation because the file is too large', async () => {
        const { user } = mount(renderComponent());
        const submitButton = getSubmitButton();
        const fileInput = getElementByType('file');

        await user.upload(fileInput, fileFixtures.fileTooLarge);

        expect(submitButton).toHaveAttribute('disabled');
        expect(screen.queryByText('No files selected')).not.toBeInTheDocument();
        expect(screen.queryByText('Invalid')).toBeInTheDocument();
    });
    it('Should fail validation because the total size of files is too large', async () => {
        const { user } = mount(renderComponent());
        const submitButton = getSubmitButton();
        const fileInput = getElementByType('file');

        await user.upload(fileInput, fileFixtures.filesTooLarge);

        expect(submitButton).toHaveAttribute('disabled');
        expect(screen.queryByText('No files selected')).not.toBeInTheDocument();
        expect(screen.queryByText(fileFixtures.filesTooLarge[0].name)).toBeInTheDocument();
    });
    it('Should fail validation because there are too many files', async () => {
        const { user } = mount(renderComponent());
        const submitButton = getSubmitButton();
        const fileInput = getElementByType('file');

        await user.upload(fileInput, fileFixtures.tooManyFiles);

        expect(submitButton).toHaveAttribute('disabled');
        expect(screen.queryByText('No files selected')).not.toBeInTheDocument();
        expect(screen.queryByText(fileFixtures.tooManyFiles[0].name)).toBeInTheDocument();
    });
    it('Should pass validation', async () => {
        const { user } = mount(renderComponent());
        const submitButton = getSubmitButton();
        const fileInput = getElementByType('file');

        expect(submitButton).toHaveAttribute('disabled');

        await user.paste(validEmail);
        await user.tab();
        await user.paste(validMessage);
        await user.upload(fileInput, fileFixtures.pass);
        await waitFor(() => expect(submitButton).not.toHaveAttribute('disabled'));

        expect(screen.queryByText(fileFixtures.pass[0].name)).toBeInTheDocument();
        expect(
            screen.queryByText((content, element) => Boolean(
                element?.classList.contains('file-size') && content === formatFileSize(fileFixtures.pass[0].size),
            )),
        ).toBeInTheDocument();
    });
    it('Should successfully upload a file and report progress', async () => {
        const { renderer, user } = mount(renderComponent());

        createXHRMock();

        const submitButton = getSubmitButton();
        const fileInput = getElementByType('file');

        await user.paste(validEmail);
        await user.tab();
        await user.paste(validMessage);
        await user.upload(fileInput, fileFixtures.pass);
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
            expect(renderer.queryByText('Message sent')).toBeInTheDocument();
        });
    });
});
