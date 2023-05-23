const noop = Function.prototype;

export default class SimpleWebSocket {
    #protocols = [];

    #socket = null;

    #url = null;

    static SOCKET_STATE = {
        CONNECTING: 0,
        OPEN: 1,
        CLOSING: 2,
        CLOSED: 3,
    };

    constructor(url = null, protocols = null) {
        this.#socket = null;
        this.#url = url;
        this.#protocols = protocols;
    }

    get getSocket() {
        return this.#socket;
    }

    get getUrl() {
        return this.#url;
    }

    get getProtocols() {
        return this.#protocols;
    }

    #create() {
        if (!this.#socket) {
            if (!this.#url) {
                const { hostname, port, protocol } = window.location;

                this.#url = `${protocol.replace('http', 'ws')}//${hostname}:${port}`;
            }

            this.#socket = new WebSocket(this.#url, this.#protocols);
        }
    }

    addEventListeners(listeners) {
        const { onOpen = noop, onMessage = noop, onError = noop, onClose = noop } = listeners;

        this.#create();

        if (this.#socket) {
            this.#socket.addEventListener('open', onOpen, false);
            this.#socket.addEventListener('message', onMessage, false);
            this.#socket.addEventListener('error', onError, false);
            this.#socket.addEventListener('close', onClose, false);
        }
    }

    removeEventListeners(listeners) {
        const { onOpen = noop, onMessage = noop, onError = noop, onClose = noop } = listeners;

        this.#create();

        if (this.#socket) {
            this.#socket.removeEventListener('open', onOpen);
            this.#socket.removeEventListener('message', onMessage);
            this.#socket.removeEventListener('error', onError);
            this.#socket.removeEventListener('close', onClose);
        }
    }

    sendRaw(rawValue) {
        this.#create();

        if (this.#socket && this.#socket.readyState === SimpleWebSocket.SOCKET_STATE.OPEN) {
            this.#socket.send(rawValue);
        }
    }

    sendEvent(event, data = null) {
        this.sendRaw(JSON.stringify({ event, data }));
    }
}
