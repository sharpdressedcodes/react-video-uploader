import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
// import { mount as enzymeMount } from 'enzyme';
import configureStore from '../../../src/stores/app';

function CustomProvider({ children, customStore }) {
    const store = customStore || configureStore();

    return (
        <Provider store={ store }>
            <BrowserRouter>
                {children}
            </BrowserRouter>
        </Provider>
    );
}

CustomProvider.displayName = 'CustomProvider';

CustomProvider.propTypes = {
    children: PropTypes.node,
    customStore: PropTypes.shape({}),
};

CustomProvider.defaultProps = {
    children: null,
    customStore: null,
};

// /**
//  * Usage:
//
// import { mountCustom } from '../../helpers/mount';
// const { wrapper, provider, store } = mountCustom(<HomePage/>);
// const component = wrapper.find(DisconnectedHomePage);
//
// You can also access the store like this:
// const provider = wrapper.getWrappingComponent();
// const store = provider.props().customStore;
//
// ...
//
// store.dispatch({ type: ActionTypes.LOAD_VIDEOS_SUCCESS, payload: videosMock });
// wrapper.update();
//
//  *
//  * @param component
//  * @param state
//  * @returns {{provider: *, wrapper: *, store: *}}
//  */
// export function mountCustom(component, state = null) {
//
//     const wrapper = enzymeMount(component, { wrappingComponent: CustomProvider });
//     const provider = wrapper.getWrappingComponent();
//     const store = configureStore(state);
//
//     provider.setProps({ customStore: store });
//
//     return { wrapper, provider, store };
// }

/**
 * Usage:

import mount from '../../helpers/mount';
const { wrapper, store } = mount(<HomePage/>);
const component = wrapper.find(DisconnectedHomePage);

You can also access the store like this:
const store = wrapper.props().store;

...

store.dispatch({ type: ActionTypes.LOAD_VIDEOS_SUCCESS, payload: videosMock });
wrapper.update();

 * @param component
 * @param state
 * @returns {{wrapper: *, store: *}}
 */
export default function mount(component, state = null) {
    const store = configureStore(state);
    // const wrapper = enzymeMount(
    const wrapper = (
        <Provider store={ store }>
            <BrowserRouter>
                {component}
            </BrowserRouter>
        </Provider>
    );

    return { wrapper, store };
}
