import Calculator from './Calculator.js';

export default class Minimum extends Calculator {
    constructor(parent, options) {
        super(parent, options);

        this.name = 'minimum';
        this.label = 'TOPIC CALCULATOR MINIMUM';
        this.debug ? LOG(this.label, 'INIT WITH TOPIC:', this.topic) : null;
    }

    // custom calculate function
    calculate() {
        super.calculate();

        if (this.enable === false)
            return;

        let values = [];
        this.source.forEach(topic => {
            if (this.topics.includes(topic)) {
                values.push(parseFloat(this.values[topic]));
                this.debug ? LOG(this.label, 'INIT WITH TOPIC:', this.topic) : null;
            }
        });

        values.sort((a, b) => a - b);
        this.value = values[0];
    }
}