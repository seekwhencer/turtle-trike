import Calculator from './Calculator.js';
import os from 'os';

export default class Ram extends Calculator {
    constructor(parent) {
        super(parent);

        this.name = 'ram';
        this.label = 'TOPIC CALCULATOR CPU';
        this.debug ? LOG(this.label, 'INIT WITH TOPIC:', this.topic.data.topic) : null;

    }

    // custom calculate function
    async calculate() {
        this.debug ? LOG(this.label, '>>> CALCULATING WITH TOPIC:', this.topic.data.topic) : null;

        if (this.enable === false)
            return;

        this.value = await this.getData();

    }

    async getData() {
        const total = os.totalmem();
        const free = os.freemem();
        const used = total - free;

        const usagePercent = (used / total) * 100;
        return usagePercent.toFixed(4);
    }

}