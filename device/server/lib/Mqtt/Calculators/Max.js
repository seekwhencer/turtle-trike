import Calculator from './Calculator.js';

export default class Maximum extends Calculator {
    constructor(parent, options) {
        super(parent, options);

        this.name = 'maximum';
        this.label = 'TOPIC CALCULATOR MAXIMUM';
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
            }
        });

        values.sort((a, b) => a - b);
        values.reverse();
        this.value = parseFloat(values[0]);
        this.debug ? LOG(this.label, parseFloat(this.value)) : null;
    }
}