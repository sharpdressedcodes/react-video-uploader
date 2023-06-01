import React, { ReactElement, ReactNode, StrictMode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';
import Providers, { PropsType as ProvidersPropsType } from '../../../src/components/Providers';
import configureStore, { RootState } from '../../../src/state/stores/app';

export { act, cleanup, fireEvent, render, screen, waitFor, waitForOptions } from '@testing-library/react';

export type RootStateType = RootState;

export const CustomProvider = ({ children, store }: ProvidersPropsType) => (
    <StrictMode>
        <Providers store={ store }>
            {children}
        </Providers>
    </StrictMode>
);

CustomProvider.displayName = 'CustomProvider';

type WrapperPropsType = {
    children: ReactNode;
};

export type MountOptionsType = {
    state?: RootState;
    initialRouterEntries?: string[];
    initialRouterIndex?: number;
    routePath?: string;
    renderRoute?: boolean;
    container?: HTMLElement;
};

// Usage:
// import React from 'react';
// import mount, { act } from '../../../../../tests/unit/helpers/mount';
// import videosMock from '../../../../../tests/unit/__mocks__/videosMock';
// import { loadVideosSuccess } from '../../../../state/reducers/loadVideos';
// import HomePage from '../components/HomePage';
//
// const renderComponent = () => <HomePage />;
//
// describe('HomePage component', () => {
//     it('Renders the component without state', () => {
//         const { renderer } = mount(renderComponent());
//
//         expect(renderer.queryByText('Current Videos')).toBeFalsy();
//         expect(document.querySelector('h2')).toBeNull();
//         expect(document.querySelector('.teaserlist')).toBeNull();
//         expect(renderer.queryByText('Acquiring video list...')).toBeInTheDocument();
//     });
//
//     it('Renders the component with state', () => {
//         const { renderer, store } = mount(renderComponent());
//
//         act(() => {
//             store.dispatch(loadVideosSuccess(videosMock));
//         });
//
//         expect(document.querySelector('h2')).toBeTruthy();
//         expect(document.querySelector('.teaserlist')).toBeTruthy();
//         expect(document.querySelector('.teaserlist li')).toBeTruthy();
//         expect(renderer.queryByText('Current Videos (1)')).toBeInTheDocument();
//
//         act(() => {
//             store.dispatch(loadVideosSuccess([]));
//         });
//
//         expect(renderer.queryByText('Current Videos')).toBeFalsy();
//         expect(document.querySelector('h2')).toBeNull();
//         expect(document.querySelector('.teaserlist')).toBeNull();
//         expect(renderer.queryByText('No videos found. Please upload a video to begin.')).toBeInTheDocument();
//     });
// });
export default function mount(component: ReactElement, {
    container,
    initialRouterEntries = ['/'],
    initialRouterIndex = 0,
    renderRoute = true,
    routePath = '/',
    state,
}: Partial<MountOptionsType> = {}) {
    const store = configureStore(state);
    const wrapper = ({ children }: WrapperPropsType) => (
        <MemoryRouter
            initialEntries={ initialRouterEntries }
            initialIndex={ initialRouterIndex }
        >
            {renderRoute && (
                <Routes>
                    <Route
                        path={ routePath }
                        element={ (
                            <CustomProvider store={ store }>
                                {children}
                            </CustomProvider>
                        ) }
                    />
                </Routes>
            )}
            {!renderRoute && (
                <CustomProvider store={ store }>
                    {children}
                </CustomProvider>
            )}
        </MemoryRouter>
    );

    return { component, wrapper, store, renderer: render(component, { wrapper, container }) };
}
