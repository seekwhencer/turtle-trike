import Events from './Events.js';
import Crypto from 'crypto';
import { spawn } from 'child_process';

export default class Module extends Events {
    constructor(parent, options) {
        super();
        this.items = [];
        parent ? this.parent = parent : null;
        this.parent ? this.parent.app ? this.app = this.parent.app : null : null;
        this.id = `${Crypto.createHash('md5').update(`${Date.now()}`).digest("hex")}`; // @TODO random hash
    }


    // --- device ---
    get server() {
        return this.app.WEBSERVER;
    }
    set server(val) { }

    // --- device ---
    get device() {
        return this.app.DEVICE;
    }
    set device(val) { }
}
