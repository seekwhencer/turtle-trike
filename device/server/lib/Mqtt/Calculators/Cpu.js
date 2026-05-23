import Calculator from './Calculator.js';
import os from 'os';

export default class Cpu extends Calculator {
    constructor(parent) {
        super(parent);

        this.name = 'cpu';
        this.label = 'TOPIC CALCULATOR CPU';
        this.debug ? LOG(this.label, 'INIT WITH TOPIC:', this.topic) : null;

    }

    // custom calculate function
    async calculate() {
        this.debug ? LOG(this.label, '>>> CALCULATING WITH TOPIC:', this.topic.data.topic) : null;

        if (this.enable === false)
            return;

        this.value = await this.getData();

    }

    async getData() {
        const usage = await this.getPerCoreUsage();
        return usage;
    }

    cpuAverage() {
        const cpus = os.cpus();

        let idle = 0;
        let total = 0;

        cpus.forEach(core => {
            for (const type in core.times) {
                total += core.times[type];
            }

            idle += core.times.idle;
        });

        return { idle, total };
    }

    getCPUUsage(interval = 10) {
        return new Promise(resolve => {
            const start = this.cpuAverage();

            setTimeout(() => {
                const end = this.cpuAverage();

                const idleDiff = end.idle - start.idle;
                const totalDiff = end.total - start.total;

                const usage = 100 - (100 * idleDiff / totalDiff);

                resolve(usage);
            }, interval);
        });
    }

    snapshot() {
        return os.cpus().map(cpu => {
            const times = cpu.times;

            const total =
                times.user +
                times.nice +
                times.sys +
                times.idle +
                times.irq;

            return {
                idle: times.idle,
                total
            };
        });
    }

    async getPerCoreUsage(interval = 1000) {
        const start = this.snapshot();

        await new Promise(resolve => setTimeout(resolve, interval));

        const end = this.snapshot();
        const index = this.topic.data.core - 1;
        const core = end[index];

        const idleDiff = core.idle - start[index].idle;
        const totalDiff = core.total - start[index].total;

        const usage = 100 - (100 * idleDiff / totalDiff);

        return Number(usage.toFixed(2));
    }
}