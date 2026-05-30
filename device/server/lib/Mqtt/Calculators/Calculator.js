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

    // --- value ---
    get value() {
        return this._value;
    }
    set value(val) {
        this._value = val; //.toFixed(this.precision) * 1;
        this.publish();
    }
    // --- topic object ---
    get topic() {
        return this.parent;
    }
    set topic(val) { }

    // --- topic's data ---
    get data() {
        return this.topic.data;
    }
    set data(val) { }

    // --- mqtt object ---
    get mqtt() {
        return this.topic.mqtt;
    }
    set mqtt(val) { }


    // --- topic sources ---
    get source() {
        return this.topic.sourceTopics;
    }
    set source(val) { }

    // --- source topics as array ---
    get topics() {
        return this.topic.topics.keys;
    }
    set topics(val) { }

    // --- source values from source topics as key-value object ---
    get values() {
        const values = {};
        this.topic.topics.keys.forEach(topic => {
            values[topic] = this.topic.topics.data[topic].value;
        });
        return values;
    }
    set values(val) {}

    // --- enable ---
    get enable() {
        return this.data.enable || true;
    }
    set enable(val) { }

    // --- debug ---
    get debug() {
        return this.data.debug || false;
    }
    set debug(val) { }

    // --- debounce ---
    get debounce() {
        return this.data.debounce || false;
    }
    set debounce(val) { }

    // --- pulse ---
    get pulse() {
        return this.data.pulse || false;
    }
    set pulse(val) { }

    // --- precision (float number precision) ---
    get precision() {
        return this.data.precision || 4;
    }
    set precision(val) { }

    // --- time zone for locale strings and numbers ---
    get timeZone() {
        return this.data.timeZone || 'Europe/Berlin';
    }
    set timeZone(val) { }
}