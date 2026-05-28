import { spawn, exec } from 'child_process';

export default class Hostapd {
    constructor(accesspoint) {

        this.ap = accesspoint;
        this.app = this.ap.app;

        this.label = 'HOSTAPD';
        this.debug = SERVER_HOSTAPD_DEBUG;

        LOG(this.label, 'INIT | DEBUG', this.debug);

        this.bin = '/usr/sbin/hostapd';
        this.binCli = '/usr/bin/hostapd_cli';
        this.configFilePath = '/etc/hostapd/hostapd.conf';

        this.statusCheckInterval = 500;
        this.statusInterval = setInterval(() => this.getStatus(), 500);
        this.state = false;

    }

    async create() {
        return await this.start();
    }

    async start() {
        const processOptions = ['-d', this.configFilePath];
        this.debug ? LOG(this.label, 'STARTING WITH OPTIONS', JSON.stringify(processOptions)) : null;

        this.errorData = '';
        this.stdData = '';

        this.process = spawn(this.bin, processOptions);
        this.process.stdout.setEncoding('utf8');
        this.process.stderr.setEncoding('utf8');
        this.process.stdout.on('data', chunk => this.observe('out', chunk));
        this.process.stderr.on('data', chunk => this.observe('err', chunk));

        return await this.status();
    }

    observe(console, chunk) {
        //LOG(this.label, console, chunk);
    }

    status() {
        return new Promise((resolve, reject) => {
            if (this.state === true) {
                return resolve(true);
            }

            const interval = setInterval(() => {
                if (this.state === true) {
                    clearInterval(interval);
                    return resolve(true);
                }
            }, 500);
        });
    }

    getStatus() {
        return new Promise((resolve, reject) => {
            exec(`${this.binCli} status`, (err, stdout = '') => {
                if (err) {
                    LOG(err);
                    return reject(err);
                }

                const match = stdout.match(/state=(\w+)/);
                const state = match?.[1] ?? false;

                this.debug ? LOG(this.label, 'STATE:', state) : null;

                if (state === 'ENABLED') {
                    this.state = true;
                    return resolve(true);
                }
            });
        });
    }
}