import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import configureStore from '../../../src/js/stores/app';

function MyProvider(props) {
    const { children, customStore } = props;
    const store = customStore || configureStore();
    return (
        <Provider store={store}>
            <BrowserRouter>
                {children}
            </BrowserRouter>
        </Provider>
    );
}

MyProvider.propTypes = {
    children: PropTypes.node,
    customStore: PropTypes.shape({}),
};
MyProvider.defaultProps = {
    children: null,
    customStore: null,
};

export default function mountWithProviderAndRouter(component, options = {}, preloadedState = null) {

    // const wrapper = shallow(component, {
    //     ...options,
    //     wrappingComponent: MyProvider,
    // });
    //
    // if (preloadedState) {
    //     const provider = wrapper.getWrappingComponent();
    //     const store = configureStore(preloadedState);
    //     provider.setProps({ customStore: store });
    // }
    //
    // return wrapper;

    const store = configureStore(preloadedState);

    const wrapper = mount(component);

    // const wrapper = mount(
    //     <Provider store={store}>
    //         <BrowserRouter>
    //             {component}
    //         </BrowserRouter>
    //     </Provider>
    // );

    return wrapper;
}
