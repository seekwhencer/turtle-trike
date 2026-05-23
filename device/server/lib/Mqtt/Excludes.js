import fs from 'fs/promises';
import path from 'path';

export default class MqttTopicExcludes extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.parent = parent;
        this.debug = false;

        this.label = 'MQTT TOPIC EXCLUDES';
        LOG(this.label, 'INIT');

        this.excludesFile = path.resolve(`${CONF.path}/excludes.json`);
        this.data = [];
    }

    async load() {
        this.debug ? LOG(this.label, 'LOAD', this.excludesFile) : null;
        try {
            const data = await fs.readFile(this.excludesFile, 'utf8');
            if (data)
                this.data = JSON.parse(data.toString());
        } catch (e) {
            console.log('>>> ERROR', e);
        }
    }

    write() {
        return new Promise((resolve, reject) => {
            LOG(this.label, 'WRITE', this.excludesFile);
            fs.writeFile(this.excludesFile, JSON.stringify(this.data), (err, data) => {
                resolve(data);
            });
        });
    }

    add(topic) {
        return new Promise((resolve, reject) => {

            if (this.contains(topic)) {
                resolve(false);
                return;
            }

            this.data.push(topic);
            this.write().then(() => resolve(true));
        });
    }

    remove(topic) {
        return new Promise((resolve, reject) => {
            LOG(this.label, 'REMOVE', topic, '');

            this.data = this.data.filter(t => t !== topic);

            //@TODO - this is not a promise...
            this.write();
            resolve(true);
        });
    }

    contains(topic) {
        return this.data.some(ex => {

            // regex
            if (typeof ex === 'string' && ex.startsWith('/') && ex.lastIndexOf('/') > 0) {
                const lastSlash = ex.lastIndexOf('/');

                const pattern = ex.slice(1, lastSlash);
                const flags = ex.slice(lastSlash + 1);

                try {
                    const regex = new RegExp(pattern, flags);
                    return regex.test(topic);
                } catch {
                }
            }

            // hash at the end
            if (ex.endsWith('#')) {
                const prefix = ex.slice(0, -1);
                return topic.startsWith(prefix);
            }

            // 1:1
            return ex === topic;
        });
    }

    get length() {
        return this.data.length;
    }

    set length(val){
        //
    }
}