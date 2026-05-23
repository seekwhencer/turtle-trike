import MqttTopic from './Topic.js';
import MqttTopicExcludes from './Excludes.js';

import path from "path";
import fs from 'fs-extra';

export default class MqttTopics extends MODULECLASS {
    constructor(parent) {
        super(parent);

        this.parent = parent;
        this.label = 'TOPICS'

        this.debug = SERVER_MQTT_CLIENT_DEBUG || false;
        this.debugLoad = SERVER_MQTT_LOAD_DEBUG;

        this.dataPath = path.resolve(`${CONF.path}/topics`);
    }

    async load() {
        this.debug ? LOG(this.label, 'LOAD TOPICS') : null;

        this.excludes = new MqttTopicExcludes(this);
        await this.excludes.load();

        //
        this.initData();

        await this.loadData();

        this.debugLoad ? LOG(this.label, 'LOAD COMPLETE.') : null;
        this.debugLoad ? LOG(this.label, '+++ TOPICS', this.keys.length) : null;
        this.debugLoad ? LOG(this.label, '+++ EXCLUDES', this.excludes.length) : null;

        this.debugLoad ? LOG(this.label, 'LOADED TOPICS', this.keys.map(t => {
            return {
                topic: this.data[t].topic,
                value: `${this.data[t].value}`
            };
        })) : null;

    }

    initData() {
        this.debugLoad ? LOG(this.label, 'INIT DATA') : null;

        this.data ? delete this.data : null;
        this.data = new Proxy({}, {
            get: (target, prop, receiver) => target[prop],
            set: (target, topic, data) => {

                // ignore excludes
                if (this.excludes.contains(topic)) {
                    this.skipped(topic);
                    return true;
                }

                // add or update
                const exists = target[topic] !== undefined ? true : false;
                if (!exists) {
                    target[topic] = new MqttTopic(this, data);
                    this.created(topic, target[topic]);

                } else {
                    target[topic].update(data);
                    this.updated(topic, target[topic]);
                }

                return true;
            }
        });
    }

    async loadData(dataPath) {
        if (!dataPath) dataPath = this.dataPath;

        this.debugLoad ? LOG(this.label, 'LOADING FROM', dataPath) : null;

        const dirStats = fs.statSync(dataPath);
        if (!dirStats.isDirectory()) return reject();

        const directories = [], files = [];
        const dirContent = fs.readdirSync(dataPath);

        dirContent.forEach(i => {
            const entry = `${dataPath}/${i}`;
            const dirStats = fs.statSync(entry);
            if (dirStats.isDirectory()) {
                directories.push(entry);
            } else {
                files.push(entry);
            }
        });

        // read files first
        files.forEach(filePath => {
            const fileData = fs.readFileSync(filePath);
            if (!fileData)
                return;

            const topicsData = JSON.parse(fileData.toString());
            this.debugLoad ? LOG(this.label, `TOPICS FROM: ${filePath} DATA >>>>>>>>>`, topicsData) : null;

            topicsData.forEach(topicData => {
                //console.log('>>>', topicData.topic);
                this.data[topicData.topic] = topicData;
            });
        });

        // then read directories
        if (!directories)
            return false;

        const proms = [];
        directories.forEach(directory => {
            const prom = this.loadData(directory);
            proms.push(prom);
        });

        await Promise.all(proms);
    }

    async loadExcludes() {
        return await this.excludesSource.load();
    }

    calculate() {
        this.debug ? LOG(this.label, 'CALCULATING ALL', this.keys) : null;
        this.keys.forEach(topic => this.data[topic].calculate());
    }

    updateTopic(topic, value) {
        if (!topic)
            return;

        this.debug ? LOG(this.label, 'UPDATING TOPIC', topic) : null;

        // add a new one
        if (!this.data[topic])
            this.data[topic] = {
                topic: topic
            };

        // and set the value
        this.data[topic].value = value;

    }

    calculateParents(sourceTopic) {
        this.keys.forEach(key => {
            const topic = this.data[key];
            if (!topic.source)
                return;

            if (topic.sourceTopics.includes(sourceTopic.topic))
                topic.calculate(sourceTopic.topic);
            
        });
    }

    created() {

    }

    updated() {

    }

    skipped(topic = null) {
        if (topic !== null)
            this.debug ? LOG(this.label, 'SKIPPED', topic) : null;
    }

    write() {
        this.debug ? LOG(this.label, 'WRITE', this.topicsSourceFile) : null;
        const data = this.topicsDefinitions.map(t => t.data);
        return fs.writeFile(this.topicsSourceFile, JSON.stringify(data));
    }

    get mqtt() {
        return this.parent;
    }

    set mqtt(val) {
        //
    }

    get keys() {
        return Object.keys(this.data);
    }

    set keys(val) {
        //
    }

    get length() {
        return this.data.length;
    }

    set length(val) {
        //
    }
}