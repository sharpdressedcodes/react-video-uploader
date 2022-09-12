// import { configure } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';
// import config from 'react-global-configuration';
// import { testConfig } from '../../../src/js/config/main';
//
// configure({ adapter: new Adapter() });
//
// config.set(testConfig);

if (typeof globalThis !== 'undefined') {
    // eslint-disable-next-line no-undef
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
}

process.on('unhandledRejection', err => {
    throw err;
});
