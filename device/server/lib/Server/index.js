import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs-extra';
import expressWs from 'express-ws';
import * as Routes from './routes/index.js';

export default class WebServer extends MODULECLASS {
    constructor(parent) {
        super(parent);

        this.label = 'WEBSERVER';
        this.debug = SERVER_DEBUG;

        LOG(this.label, 'INIT', '| DEBUG:', this.debug);

        this.parent = parent;
        this.port = SERVER_PORT || 3000;

        if (!SERVER_WEBSERVER_ENABLE)
            return false

        //process.env.NODE_ENV === 'production' ? this.env = 'prod' : this.env = 'dev';
        this.documentRoot = path.resolve(`${APP_DIR}/${SERVER_FRONTEND_PATH}`);

        global.EXPRESS = express;
        this.engine = EXPRESS();
        this.ws = expressWs(this.engine);

        this.clients = new Set();

        // websocket connection
        this.engine.ws('/live', (ws, req) => {
            this.debug ? LOG(this.label, 'WEBSOCKET CLIENT CONNECTED') : null;

            this.clients.add(ws);

            ws.on('message', msg => {
                this.debug ? LOG(this.label, '>>> WEBSOCKET MESSAGE', msg) : null;
                //ws.send(msg);
            });

            ws.on('close', () => {
                this.debug ? LOG(this.label, 'WEBSOCKET CLIENT DISCONNECTED') : null;

                // client entfernen
                this.clients.delete(ws);
            });

        });

        // json
        this.engine.use(express.json());

        // statics
        this.engine.use(express.static(this.documentRoot, {
            etag: true,
            lastModified: true,
            setHeaders: (res) => {
                res.setHeader('Cache-Control', 'no-store');
            }
        }));

        // the routes
        Object.keys(Routes).forEach(route => this.engine.use(`/`, new Routes[route](this)));
    }

    async create() {
        return new Promise((resolve, reject) => {
            this.server = this.engine.listen(this.port, () => {
                LOG(this.label, 'IS LISTENING ON PORT:', this.port);
                resolve(this);
            });
        });
    }

    async close() {
        return new Promise((resolve, reject) => this.server.close(() => resolve()));
    }

    sendAll(msg) {
        for (const client of this.clients) {
            if (client.readyState === 1)
                client.send(msg);
        }
    }
}