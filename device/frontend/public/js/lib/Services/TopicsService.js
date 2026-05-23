import Service from "./Service.js";
export default class TopicsService extends Service {
    constructor(parent, options = {}) {
        super(parent, options);

        this.debug = false;
    }

    message(data) {
        if(typeof data === 'string')
            data = JSON.parse(data);

        this.debug ? console.log('>>> TOPICS SERVICE RECEIVED MESSAGE', data) : null;
        // do things here

        this.topics[data.topic] = data.value;
    }

    get topics() {
        return this.stores.topics;
    }

    set topics(val) {
        //
    }
}