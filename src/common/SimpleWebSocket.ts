const noop = (): any => null;

export type SimpleWebSocketListenersType = {
    onOpen?: (event: Event) => any,
    onMessage?: (event: MessageEvent) => any,
    onError?: (event: Event) => any,
    onClose?: (event: Event) => any,
}

export default class SimpleWebSocket {
    protected protocols: string | string[] = [];
    protected socket: Nullable<WebSocket> = null;
    protected url: Nullable<string> = null;

    constructor(url: Nullable<string> = null, protocols: string | string[] = []) {
        this.socket = null;
        this.url = url;
        this.protocols = protocols;
    }

    get getSocket(): Nullable<WebSocket> {
        return this.socket;
    }

    get getUrl(): Nullable<string> {
        return this.url;
    }

    get getProtocols(): string | string[] {
        return this.protocols;
    }

    protected create(): void {
        if (!this.socket) {
            if (!this.url) {
                const { hostname, port, protocol } = window.location;

                this.url = `${protocol.replace('http', 'ws')}//${hostname}:${port}`;
            }

            this.socket = new WebSocket(this.url, this.protocols);
        }
    }

    addEventListeners(listeners: SimpleWebSocketListenersType): void {
        const { onOpen = noop, onMessage = noop, onError = noop, onClose = noop } = listeners;

        this.create();

        if (this.socket) {
            this.socket.addEventListener('open', onOpen);
            this.socket.addEventListener('close', onClose);
            this.socket.addEventListener('message', onMessage);
            this.socket.addEventListener('error', onError);
        }
    }

    removeEventListeners(listeners: SimpleWebSocketListenersType): void {
        const { onOpen = noop, onMessage = noop, onError = noop, onClose = noop } = listeners;

        this.create();

        if (this.socket) {
            this.socket.removeEventListener('open', onOpen);
            this.socket.removeEventListener('close', onClose);
            this.socket.removeEventListener('message', onMessage);
            this.socket.removeEventListener('error', onError);
        }
    }

    sendRaw(rawValue: string | ArrayBufferLike | Blob | ArrayBufferView): void {
        this.create();

        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(rawValue);
        }
    }

    sendEvent(event: any, data: any = null): void {
        this.sendRaw(JSON.stringify({ event, data }));
    }
}
