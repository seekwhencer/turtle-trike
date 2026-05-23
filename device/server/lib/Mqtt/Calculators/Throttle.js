import Calculator from './Calculator.js';

export default class Throttle extends Calculator {
    constructor(parent) {
        super(parent);

        this.name = 'throttle';
        this.label = 'TOPIC CALCULATOR THROTTLE';
        this.debug ? LOG(this.label, 'INIT WITH TOPIC:', this.topic.data.topic) : null;

        this.side = this.topic.data.topic;

    }

    // custom calculate function
    async calculate() {
        this.debug ? LOG(this.label, '>>> CALCULATING WITH TOPIC:', this.topic.data.topic) : null;

        if (this.enable === false)
            return;

        this.value = await this.getData();

    }

    async getData() {
        return Date.now();
    }

}