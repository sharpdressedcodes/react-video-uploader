const { WebSocketServer } = require('ws');

let webSocketServer = null;
let webSocket = null;

const loadWebSocket = (server, options = {}) => (req, res, next) => {
    try {
        // Only load the socket once, otherwise we get warnings about upgrading the connection
        if (typeof req.app.locals.getWebSocketServer !== 'function') {
            webSocketServer = new WebSocketServer({ server, ...options });

            webSocketServer.on('connection', ws => {
                webSocket = ws;
            });

            req.app.locals.getWebSocketServer = () => webSocketServer;
            req.app.locals.getWebSocket = () => webSocket;
        }

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = loadWebSocket;
