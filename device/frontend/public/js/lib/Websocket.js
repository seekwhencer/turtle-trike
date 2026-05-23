export default class Websocket {
    constructor(page, options = {}) {
        this.page = page;
        this.options = options;

        this.url = `ws://${document.location.host}${document.location.port !== 80 ? `:${document.location.port}` : ''}/live`;
        this.reconnectDelay = options.reconnectDelay || 2000;
        this.maxReconnectDelay = options.maxReconnectDelay || 30000;
        this.autoReconnect = options.autoReconnect !== false;

        this.ws = null;
        this.connected = false;
        this.messageQueue = [];

        
    }

    connect() {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            console.log("WebSocket connected");
            this.connected = true;

            // queued messages senden
            while (this.messageQueue.length > 0) {
                this.ws.send(this.messageQueue.shift());
            }

            if (this.onopen) this.onopen();
        };

        this.ws.onmessage = (event) => this.message(event.data);


        this.ws.onerror = (err) => {
            console.error("WebSocket error:", err);
            if (this.onerror) this.onerror(err);
        };

        this.ws.onclose = () => {
            console.log("WebSocket disconnected");
            this.connected = false;

            if (this.onclose) this.onclose();

            if (this.autoReconnect) {
                setTimeout(() => {
                    console.log("Reconnecting...");
                    this.connect();

                    // optional: exponential backoff
                    this.reconnectDelay = Math.min(
                        this.reconnectDelay * 2,
                        this.maxReconnectDelay
                    );
                }, this.reconnectDelay);
            }
        };
    }

    send(data) {
        const message =
            typeof data === "string" ? data : JSON.stringify(data);

        if (this.connected && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(message);
        } else {
            console.log("Socket not connected, queueing message");
            this.messageQueue.push(message);
        }
    }

    message(data) {
        this.page.message(data);
    }

    close() {
        this.autoReconnect = false;
        this.ws.close();
    }
}