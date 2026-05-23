import Calculator from './Calculator.js';

export default class Switch extends Calculator {
    constructor(parent, options) {
        super(parent, options);

        this.name = 'switch';
        this.label = 'TOPIC CALCULATOR SWITCH';
        this.debug ? LOG(this.label, 'INIT WITH TOPIC:', this.topic) : null;

        // register property scheduling
        this.schedule();

        // run the latest cron job(s) for properties
        this.runLatestJob();
    }

    calculate(topic = false) {
        super.calculate(topic);

        if (this.enable === false)
            return;

        //this.debug ? LOG(this.label, 'CALCULATE NOTHING', this.value, this.topic) : null;
    }

    get toggle() {
        return this._toggle;
    }

    set toggle(val) {
        this.state === 1 ? this.state = 0 : this.state = 1;
        this.debug ? LOG(this.label, 'TOGGLE:', this.state) : null;
        this._toggle = val;
    }

    get state() {
        return this._state;
    }

    set state(val) {
        if (val !== 0 && val !== 1)
            return;

        this._state = val;
        this.value = this.state;
        this.debug ? LOG(this.label, 'STATE:', this.state) : null;
    }
}