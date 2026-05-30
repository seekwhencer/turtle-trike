import fs from 'fs-extra';

import MqttClient from './Client.js';
import MqttTopics from './Topics.js';

export default class Mqtt extends MODULECLASS {
    constructor(parent) {
        super(parent);

        this.label = 'MQTT'
        this.parent = parent;
        this.debug = SERVER_MQTT_DEBUG;
        this.debugPublish = SERVER_MQTT_PUBLISH_DEBUG;

        LOG(this.label, 'INIT | DEBUG', this.debug);
    }

    async create() {
        await this.initClient();

        this.topics = new MqttTopics(this);
        await this.topics.load();
    }

    async initClient() {
        this.client = new MqttClient(this);
        const connection = await this.client.connect();
    }

    publish(topic, value) {
        this.debugPublish ? LOG(this.label, 'PUBLISHING', topic, value.toString()) : null;
        this.client.publish(topic, value.toString());
    }

    message(topic, value) {
        this.debug ? LOG(this.label, 'RECEIVED:', topic.padEnd(40, '-'), value) : null;

        //
        this.topics.updateTopic(topic, value);

        // send websocket stuff
        const wsData = {
            topic: topic,
            value: value,
            time: Date.now()
        };
        this.server.sendAll(JSON.stringify(wsData));
    }
}