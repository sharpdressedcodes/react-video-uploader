import config from 'react-global-configuration';
import mainConfig, { testConfig } from '../../config/main';

export default function loadConfig(req, res, next) {

    req.app.locals.isTesting = req.cookies && req.cookies.__IS_TESTING__ === '1';

    if (req.app.locals.isTesting) {
        config.set(req.app.locals.isTesting ? testConfig : mainConfig, { freeze: false });
    }

    next();
}
