import Calculator from './Calculator.js';

export default class Average extends Calculator {
    constructor(parent, options) {
        super(parent, options);

        this.name = 'average';
        this.label = 'TOPIC CALCULATOR AVERAGE';
        this.debug ? LOG(this.label, 'INIT WITH TOPIC:', this.topic.data.topic) : null;
    }

    // custom calculate function
    calculate(topic) {
        super.calculate(topic);

        if(!topic)
            return;

        if (this.enable === false)
            return;

        let value = 0, count = 0;
        this.source.forEach(topic => {
            if (this.topics.includes(topic)) {
                value += parseFloat(this.values[topic]) || 0;
                count++;
            }
        });

        if (count === this.source.length) {
            this.value = value / this.source.length;
        } else {
            this.debug ? LOG(this.label, 'MISSING', (this.source.length - count), 'SOURCE(S)') : null;
        }
    }
}