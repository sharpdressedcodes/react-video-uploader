import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import config from 'react-global-configuration';
import { testConfig } from '../../../src/js/config/main';

configure({ adapter: new Adapter() });

config.set(testConfig);

process.on('unhandledRejection', err => {
    throw err;
});
