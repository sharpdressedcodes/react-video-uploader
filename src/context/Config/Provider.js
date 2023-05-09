import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import Context from './Config';
import mainConfig, { testConfig } from '../../config/index.cjs';

const Provider = ({ children }) => (
    <Context.Provider value={ useMemo(process.env.NODE_ENV === 'test' ? () => ({ config: testConfig }) : () => ({ config: mainConfig }), []) }>
        {children}
    </Context.Provider>
);

Provider.displayName = 'ConfigProvider';

Provider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default memo(Provider);
