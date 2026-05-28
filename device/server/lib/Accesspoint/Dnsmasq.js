import { spawn, exec } from 'child_process';

export default class Dnsmasq {
    constructor(accesspoint) {

        this.ap = accesspoint;
        this.app = this.ap.app;

        this.label = 'DNSMASQ';
        this.debug = SERVER_DNSMASQ_DEBUG;

        this.bin = '/usr/sbin/dnsmasq';
        this.runConfig = '/etc/dnsmasq.conf';

        LOG(this.label, 'INIT | DEBUG', this.debug);

    }

    async create() {
        return await this.start();
    }

    async start() {
        const processOptions = ['-C', this.runConfig, '--no-daemon', '--log-debug'];
        LOG(this.label, 'STARTING WITH OPTIONS', JSON.stringify(processOptions));

        this.process = spawn(this.bin, processOptions);
        this.process.stderr.setEncoding('utf8');
        this.process.stdout.setEncoding('utf8');
        this.process.stderr.on('data', chunk => this.observe('err', chunk));
        this.process.stdout.on('data', chunk => this.observe('out', chunk));

        return await this.status();
    }

    observe(console, chunk) {
        LOG(this.label, 'OBSERVE', console, chunk);

    }

    async status() {

    }




}