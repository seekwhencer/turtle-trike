import Psychrometrics from '../Psychrometrics.js';
import { CronJob } from 'cron';
import CronParser from 'cron-parser';

export default class Calculator extends MODULECLASS {
    constructor(parent) {
        super(parent);
        this.label = 'CALCULATOR DEFAULT';
        this.name = 'default';

        this.pm = new Psychrometrics();
        this.pm.SetUnitSystem(this.pm.SI);

        this.value = null;

        if (this.pulse !== false)
            this.interval = setInterval(() => this.calculate(), this.pulse);
    }

    calculate(topic) {
        if (!topic)
            return;

        if (this.enable === false)
            return;

    }

    publish() {
        if (this.value === null)
            return;

        if (this.debounce !== false) {
            if (this.timeout)
                clearTimeout(this.timeout);

            this.timeout = setTimeout(() => this.mqtt.publish(this.data.topic, this.value), this.debounce);
        } else {
            this.mqtt.publish(this.data.topic, this.value);
        }

    }

    get value() {
        return this._value;
    }
    set value(val) {
        this._value = val; //.toFixed(this.precision) * 1;
        this.publish();
    }

    get topic() {
        return this.parent;
    }
    set topic(val) { }

    get data() {
        return this.topic.data;
    }
    set data(val) { }

    get mqtt() {
        return this.topic.mqtt;
    }
    set mqtt(val) { }


    get source() {
        return this.topic.sourceTopics;
    }
    set source(val) { }

    get topics() {
        return this.topic.topics.keys;
    }
    set topics(val) { }

    get values() {
        const values = {};
        this.topic.topics.keys.forEach(topic => {
            values[topic] = this.topic.topics.data[topic].value;
        });
        return values;
    }
    set values(val) {
        //
    }

    get enable() {
        return this.data.enable || true;
    }
    set enable(val) { }

    get debug() {
        return this.data.debug || false;
    }
    set debug(val) { }

    get debounce() {
        return this.data.debounce || false;
    }
    set debounce(val) { }

    get pulse() {
        return this.data.pulse || false;
    }
    set pulse(val) { }

    get precision() {
        return this.data.precision || 4;
    }
    set precision(val) { }

    get timeZone() {
        return this.data.timeZone || 'Europe/Berlin';
    }
    set timeZone(val) { }
}