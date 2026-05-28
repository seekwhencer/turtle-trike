import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

export default class Serial {
    constructor(app) {
        this.app = app;

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
            
        } else {
            console.log('ESP32:', data);
        }
    }
}


