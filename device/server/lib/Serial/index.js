import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

export default class Serial {
    constructor(app) {
        this.app = app;
        this.label = 'SERIAL';
        this.debug = true;

        LOG(this.label, 'INIT', '| DEBUG:', this.debug);

        this.port = new SerialPort({
            path: '/dev/ttyUSB0',
            baudRate: 115200
        });

        this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\n' }));

        this.parser.on('data', line => this.observe(line));

        //this.port.write('PING\n');

    }

    observe(line) {
        let data = false;
        try {
            data = JSON.parse(line);
        } catch (e) {
            data = line;
        }

        if (typeof data === 'object') {
            this.debug ? LOG(this.label, 'DATA', data) : null;
            this.receiveData(data);
        } else {
            this.debug ? LOG(this.label, 'STD', data) : null;
        }
    }

    receiveData(data) {
        // ... do things here
    }

    sendData(data) {
        const message = JSON.stringify(data);
        this.port.write(`${message}\n`);
    }
}


