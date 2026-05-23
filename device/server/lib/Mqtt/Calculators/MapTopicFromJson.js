import Calculator from './Calculator.js';

export default class MapTopicFromJson extends Calculator {
    constructor(parent, options) {
        super(parent, options);

        this.name = 'maptopicfromjson';
        this.label = 'TOPIC CALCULATOR MAP TOPIC FROM JSON';
        this.debug ? LOG(this.label, 'INIT WITH TOPIC:', this.topic) : null;
    }

    calculate() {
        super.calculate();
        
        if (this.enable === false)
            return;

        const sourceTopic = this.parent.source.data;

        if (!sourceTopic)
            return;

        if (!this.values[sourceTopic])
            return;

        const data = JSON.parse(this.values[sourceTopic]);
        const value = data[this.field];

        if (!value)
            return;

        if (this.transform === 'string-boolean') {
            value === 'true' ? this.value = 1 : null;
            value === 'false' ? this.value = 0 : null;
        }

        if (this.transform === 'string-float') {
            this.value = parseFloat(value);
        }
    }

    get field() {
        return this.options.field;
    }

    set field(val) {
        // do nothing
    }
}