import { Server as NodeServer } from 'node:http';
import { Server, ServerOptions, WebSocket, WebSocketServer } from 'ws';
import { RequestHandler } from 'express';

let webSocketServer: Nullable<Server> = null;
let webSocket: Nullable<WebSocket> = null;

const loadWebSocket = (server: NodeServer, options: ServerOptions = {}): RequestHandler => (req, res, next) => {
    try {
        // Only load the socket once, otherwise we get warnings about upgrading the connection
        if (typeof req.app.locals.getWebSocketServer !== 'function') {
            webSocketServer = new WebSocketServer({ server, ...options });

            webSocketServer.on('connection', (ws: WebSocket) => {
                webSocket = ws;
            });

            req.app.locals.getWebSocketServer = () => webSocketServer as Server;
            req.app.locals.getWebSocket = () => webSocket as WebSocket;
        }

        next();
    } catch (err) {
        next(err);
    }
};

export default loadWebSocket;
