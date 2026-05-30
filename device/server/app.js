//console.clear();
console.log('');
console.log('');
console.log('---------------');
console.log('');

import './lib/Global/Globals.js';
import Config from './lib/Global/Config.js';
import WebServer from './lib/Server/index.js';
import Mqtt from './lib/Mqtt/index.js';
import Accesspoint from './lib/Accesspoint/index.js';
import Serial from './lib/Serial/index.js';
import Device from './lib/Device/index.js';

export default class App extends MODULECLASS {
    constructor() {
        super();
        this.label = 'APP';
    }

    async start() {
        global.APP = this.app = this;

        // config
        global.CONF = this.CONFIG = new Config(this);
        await this.CONFIG.create();

        // mqtt
        this.MQTT = new Mqtt(this);
        await this.MQTT.create();

        // webserver
        this.WEBSERVER = new WebServer(this);
        await this.WEBSERVER.create();

        // dnsmasq + hostapd (if needed)
        this.AP = new Accesspoint(this);
        await this.AP.create();

        // serial interface to the esp
        this.SERIAL = new Serial(this);

        // the device
        this.DEVICE = new Device(this);


    }

    async restart() {
        LOG(this.label, 'RESTARTING....');
        await this.WEBSERVER.close();

        delete global.CONF,
            global.CONFIG,
            global.APP.MQTT,
            global.APP.WEBSERVER,
            global.APP.AP,
            global.APP.SERIAL,
            global.APP.DEVICE,
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