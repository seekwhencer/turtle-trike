import Calculator from './Calculator.js';
import { exec } from 'child_process';

export default class Wifi extends Calculator {
    constructor(parent, options) {
        super(parent, options);

        this.name = 'wifi';
        this.label = 'TOPIC CALCULATOR WIFI';
        this.debug ? LOG(this.label, 'INIT WITH TOPIC:', this.topic.data.topic) : null;
    }

    // custom calculate function
    async calculate(topic) {
        super.calculate(topic);

        if (this.enable === false)
            return;

        this.value = await this.command();
    }

    command() {
        return new Promise((resolve, reject) => {
            exec(`iw dev ${this.topic.data.device} link`, (err, stdout) => {
                if (err)
                    return reject(err);

                const match = stdout.match(/signal:\s(-\d+)/);

                return resolve(match ? match[1] : null);
                
            });
        });
    }


}