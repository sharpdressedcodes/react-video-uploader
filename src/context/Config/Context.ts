import { createContext } from 'react';
import config, { ConfigType } from '../../config';

export type ConfigContextType = ConfigType;

const ConfigContext = createContext<ConfigContextType>(config);

ConfigContext.displayName = 'ConfigContext';

export default ConfigContext;
