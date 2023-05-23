import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from '../../../src/state/stores/app';

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
    customStore: PropTypes.object,
};

CustomProvider.defaultProps = {
    children: null,
    customStore: null,
};

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
