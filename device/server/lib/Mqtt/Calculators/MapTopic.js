import Calculator from './Calculator.js';

export default class MapTopic extends Calculator {
    constructor(parent, options) {
        super(parent, options);
        this.name = 'maptopic';
        this.label = 'TOPIC CALCULATOR MAP TOPIC';
        this.debug ? LOG(this.label, 'INIT WITH TOPIC:', this.topic) : null;

        //this.runLatestJob();
    }

    calculate(topic = false) {
        super.calculate(topic);

        if (this.enable === false)
            return;

        if(!topic)
            return;

        if(!this.values[topic])
            return;

        this.debug ? LOG(this.label, '>>>>>>>>>>>>', topic, this.values[topic], this.values) : null;
        this.value = this.values[topic];
    }
}