import Module from './Module.js';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';

export default class Config extends Module {
    constructor() {
        super();

        this.label = 'CONFIG';
        this.configDir = 'config';

        this.debug = false;
        LOG(this.label, 'INIT | DEBUG:', this.debug);
    }

    async create() {
        this.path = path.resolve(`${APP_DIR}/${this.configDir}`);

        this.typesFile = `${this.path}/types.json`;
        this.typeDefinitions = fs.readJsonSync(this.typesFile);
        this.flattenTypes();

        this.configFile = `${this.path}/${ENVIRONMENT}.conf`;
        this.envFile = `${path.resolve(`${APP_DIR}/..`)}/.env`;

        this.on('loaded', () => LOG(this.label, 'LOADING COMPLETE', { verbose: 2 }));

        this.data = {
            env: {},
            envFile: {},
            configFile: {}
        };

        this.configData = new Proxy({}, {
            get: (target, prop, receiver) => {
                return this.convertTypeRead(target[prop] || this.data.env[prop] || this.data.configFile[prop] || this.data.envFile[prop], prop);
            },
            set: (target, prop, value) => {
                target[prop] = this.convertTypeWrite(value, prop);
                return true;
            }
        });

        global.CONFIG = this.configData;

        const ok = await this.load();
        if (ok === true) {
            // map the config data into the global scope
            // @TODO - filter allowed
            this.properties.forEach(prop => global[prop] = this.configData[prop]);

        };
    }

    async load() {
        this.data.env = process.env;
        this.data.configFile = await this.loadConfigFile(this.configFile)
        this.data.envFile = await this.loadConfigFile(this.envFile);
        return true;
    }

    async loadConfigFile(configFile) {
        try {
            let configData = await fs.readFile(configFile);
            return dotenv.parse(configData);
        } catch (err) {
            ERROR(this.label, err);
        };
    }

    async reload() {
        return await this.load();
    }

    /**
     * expand comma separated values to an array
     * @TODO unused
     */
    expandArrays() {
        const envKeys = Object.keys(this.configData);
        envKeys.forEach(k => {
            const split = this.configData[k].split(',');
            if (split.length > 1) {
                const arrayData = [];
                split.forEach(s => arrayData.push(s.trim()));
                this.configData[k] = arrayData;
            }
        });
    }

    flattenTypes() {
        this.types = {};
        Object.keys(this.typeDefinitions).forEach(type => {
            this.typeDefinitions[type].forEach(prop => {
                this.types[prop] = type;
            });
        });
    }

    convertTypeRead(value, property) {
        if (value === undefined)
            return;

        const type = this.types[property];

        if (value.toLowerCase) {
            if (value.toLowerCase() === 'true' || value.toLowerCase() === 'yes') {
                return true;
            }
            if (value.toLowerCase() === 'false' || value.toLowerCase() === 'no') {
                return false;
            }
        }

        if (type === 'boolean') {
            if (value === '1') {
                return true;
            }
            if (value === '0') {
                return false;
            }
        }

        if (type === 'int')
            return parseInt(value);

        return value;
    }

    convertTypeWrite(value, property) {
        const type = this.types[property];

        if (type === 'boolean') {
            if (value === true || value === 'true') {
                return '1';
            }
            if (value === false || value === 'false') {
                return '0';
            }
        }

        if (type === 'int')
            return value.toString();

        return value;
    }

    get properties() {
        const props = [];
        Object.keys(this.data).forEach(key => Object.keys(this.data[key]).forEach(prop => !props.includes(prop) ? props.push(prop) : null))
        props.sort();
        return props;
    }

    set properties(val) {

    }

}
