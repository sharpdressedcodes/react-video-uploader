import React, { memo, ReactNode, useMemo } from 'react';
import Context from './Context';
import mainConfig, { testConfig, ConfigType } from '../../config';

type PropsType = {
    children: ReactNode;
};

const Provider = ({ children }: PropsType) => (
    <Context.Provider value={ useMemo<ConfigType>(() => (process.env.NODE_ENV === 'test' ? testConfig : mainConfig), []) }>
        {children}
    </Context.Provider>
);

Provider.displayName = 'ConfigProvider';

export default memo<PropsType>(Provider);
