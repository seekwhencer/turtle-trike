import * as Calculators from "./Calculators/index.js";

export default class MqttTopic extends MODULECLASS {
    constructor(parent, topicData) {
        super(parent);
        this.label = 'TOPIC';
        this.debug = true;         // can be overridden with a debug = true property in the json file

        // options
        this.maxHistoryLength = parseInt(global?.MQTT_MAX_HISTORY_LENGTH);
        this.maxHistoryAge = parseInt(global?.MQTT_MAX_HISTORY_AGE);

        //
        this.lastPublishTime = false;

        // the repeat publish timer
        this.repeatPublishTimer = false;

        // the value history
        this.history = [];

        // garbage collector
        this.clearHistoryTimer = setInterval(() => this.clearHistory(), 500);

        //
        this.calculator = null;

        //
        this.source = null;

        //
        this.initData(topicData);

        //
        this.setCalculator(this.data.calculator);
    }

    initData(topicData) {
        this.debugLoad ? LOG(this.label, 'INIT DATA') : null;

        if (topicData.source) {
            this.source = topicData.source;
            delete topicData.source;
        }

        if (topicData.value) {
            this.value = topicData.value;
            delete topicData.value;
        }

        this.data ? delete this.data : null;
        this.data = topicData;
    }

    setCalculator(name) {
        this.debug ? LOG(this.label, 'SET CALCULATOR', name) : null;
        
        const CalculatorClass = Calculators[name];
        if (!CalculatorClass)
            return false;

        if (this.calculator)
            delete this.calculator;

        this.calculator = new CalculatorClass(this);
    }

    calculate(topic) {
        if (!this.calculator)
            return;
        
        //
        this.calculator.calculate(topic);
    }

    update(data) {
        this.data = { ...this.data, data };
    }

    publish() {
        this.mqtt.publish(this.data.topic, this.value);
    }

    clearHistory() {
        // store latest value
        let latest = false;
        this.history.length > 0 ? latest = this.history[0] : null;

        this.clearHistoryByAge();
        this.clearHistoryByLength();

        // restore latest value
        this.history.length === 0 && latest ? this.history.push(latest) : null;
    }

    clearHistoryByAge() {
        if (this.maxHistoryAge === -1)
            return

        const age = Date.now() - (this.maxHistoryAge * 1000);
        this.history = this.history.filter(v => v.time > age);
    }

    clearHistoryByLength() {
        if (this.maxHistoryLength === -1)
            return

        this.history = this.history.slice(0, this.maxHistoryLength - 1);
    }

    //
    // getter and setter
    //
    get keys() {
        return Object.keys(this.data);
    }

    set keys(val) {
        // do nothing
    }

    get topics() {
        return this.parent;
    }

    set topics(val) {
        //
    }

    get mqtt() {
        return this.topics.mqtt;
    }

    set mqtt(val) {
        //
    }

    get topic() {
        return this.data.topic;
    }

    set topic(val) {
        // do nothing
    }

    get value() {
        return this.history.length > 0 ? this.history[0].value : false;
    }

    set value(val) {
        if (!val)
            return;

        this.clearHistory();
        this.history.unshift({
            value: val,
            time: Date.now()
        });

        this.topics.calculateParents(this.data);
    }

    get time() {
        return this.history.length > 0 ? this.history[0].time : false;
    }

    set time(val) {
        // do nothing
    }

    get sourceTopics() {
        const sourceType = typeof this.source === 'object' ? Array.isArray(this.source) ? 'array' : 'object' : 'string';
        const topics = sourceType === 'object' ? sourceType === 'array' ? this.source : Object.values(this.source) : [this.source];

        return topics;
    }

    set sourceTopics(val) {
        //
    }
}