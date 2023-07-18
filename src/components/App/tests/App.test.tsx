import React from 'react';
import mount, { screen, waitFor } from '../../../../tests/unit/helpers/mount';
import videosMock from '../../../../tests/unit/__mocks__/videosMock';
import App from '../components/App';

const renderComponent = (data: any = []) => <App data={ data } />;
const renderOptions = ({ renderRoute: false });

describe('App component', () => {
    it('Renders the component and waits for suspended lazy child components to resolve', async () => {
        mount(renderComponent(), renderOptions);

        expect(screen.getByRole('heading')).toHaveTextContent('Video Uploader');
        expect(document.querySelector('.page-home')).toBeNull();
        expect(document.querySelector('.global-spinner')).toBeTruthy();

        await waitFor(() => expect(document.querySelector('.page-home')).toBeTruthy());

        expect(document.querySelector('.global-spinner')).toBeNull();
    });

    it('Renders the components with data', async () => {
        const { renderer } = mount(renderComponent(), renderOptions);

        await waitFor(() => expect(document.querySelector('.page-home')).toBeTruthy());

        expect(document.querySelector('h2')).toBeNull();
        expect(document.querySelector('.teaserlist')).toBeNull();
        expect(document.querySelector('.teaserlist li')).toBeNull();

        renderer.rerender(renderComponent(videosMock));

        expect(document.querySelector('h2')).toBeTruthy();
        expect(document.querySelector('.teaserlist')).toBeTruthy();
        expect(document.querySelector('.teaserlist li')).toBeTruthy();
        expect(renderer.queryByText('Current Videos (1)')).toBeInTheDocument();
    });
});
