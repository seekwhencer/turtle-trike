//console.clear();
console.log('');
console.log('');
console.log('---------------');
console.log('');

import './lib/Global/Globals.js';
import Config from './lib/Global/Config.js';
import WebServer from './lib/Server/index.js';
import Mqtt from './lib/Mqtt/index.js';

export default class App extends MODULECLASS {
    constructor() {
        super();
        this.label = 'APP';
    }

    async start() {
        global.APP = this;

        // config
        global.CONF = this.CONFIG = new Config(this);
        await this.CONFIG.create();

        // mqtt
        this.MQTT = new Mqtt(this);
        await this.MQTT.create();

        // webserver
        this.WEBSERVER = new WebServer(this);
        await this.WEBSERVER.create();
    }

    async restart() {
        LOG(this.label, 'RESTARTING....');
        await this.WEBSERVER.close();

        delete global.CONF,
            global.CONFIG,
            global.APP.MQTT,
            global.APP.WEBSERVER,
            global.APP;

        return await this.start();
    }

    async reloadTopics() {
        return await global.APP.MQTT.load();
    }

    getTopics() {
        return global.APP.MQTT.topicsDefinitions;
    }
}