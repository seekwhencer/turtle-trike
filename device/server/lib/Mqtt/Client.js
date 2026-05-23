import * as mqtt from "mqtt"

export default class MqttClient extends MODULECLASS {
    constructor(parent) {
        super(parent);

        this.label = 'MQTT CLIENT'
        this.debug = SERVER_MQTT_CLIENT_DEBUG || false;

        this.parent = parent;

        this.options = {
            connection: {
                clientId: 'app',
                reconnectPeriod: 1000,
                connectTimeout: 30 * 1000
                //...
            }
        }

        this.url = `mqtt://${MQTT_HOST}:${MQTT_PORT}`;
        LOG(this.label, 'INIT | DEBUG:', this.debug, '| ON:', this.url);
    }

    async create() {
        return await this.connect();
    }

    async connect() {
        // connecting
        this.debug ? LOG(this.label, 'CONNECTING TO:', this.url) : null;
        this.connection = mqtt.connect(this.url, this.options.connection);

        // add events
        this.connection.on('connect', () => this.emit('connect'));
        this.connection.on('reconnect', () => this.emit('reconnect'));
        this.connection.on('close', () => this.emit('close'));
        this.connection.on('disconnect', (packet) => this.emit('disconnect', packet));
        this.connection.on('offline', () => this.emit('offline'));
        this.connection.on('error', (error) => this.emit('error', error));
        this.connection.on('message', (topic, buffer) => this.message(topic, buffer));

        // subscribe all topics
        this.subscribe('#');

        return new Promise((resolve, reject) => {
            this.onConnect ? this.removeListener('connect', this.onConnect) : null;
            this.onConnect = this.on('connect', () => {
                this.debug ? LOG(this.label, 'CONNECTED TO:', this.url) : null;
                resolve(this.connection);
            });
        });
    }

    subscribe(topic) {
        this.connection.subscribe(topic, err => this.error(err));
    }

    publish(topic, data) {
        this.connection.publish(topic, data);
    }

    message(topic, buffer) {
        this.mqtt.message(topic.toString(), buffer.toString());
    }
    
    disconnect() {
        this.connection.end();
    }

    reconnect() {
        this.connection.reconnect();
    }

    error(err) {
        if (err) {
            LOG(this.label, err);
        }
    }

    get mqtt() {
        return this.parent;
    }

    set mqtt(val) {
        //
    }
}