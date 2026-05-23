import Store from "./Store.js";
import Topic from "./Topic.js";
/**
 * the key is the full length topic
 * 
 */
export default class TopicsStore extends Store {
    constructor(stores, options = {}) {
        super(stores, options);
        this.dataSource = options.data || {};

        this.data = new Proxy(this.dataSource, {

            get: (target, prop, receiver) => {
                return target[prop] || this.dataSource[prop];
            },

            set: (target, prop, value) => {
                if (target[prop] === value) {
                    this.skipped(prop, value, target[prop]);
                    return true;
                }

                const existing = !!target[prop];
                const action = existing ? 'update' : 'create';

                //target[prop] = value;

                if (action === 'create') {
                    target[prop] = new Topic(this, prop, value);
                    this.created(prop, value, target[prop]);
                }
                
                if (action === 'update') {
                    target[prop].value = value;
                    this.updated(prop, value, target[prop]);
                }

                return true;
            },

            deleteProperty: (target, prop, receiver) => {
                delete target[prop];
                this.deleted(prop, target);
                return true;
            },
        });
    }



    created(prop, value) {

    }

    updated(prop, value) {

    }

    skipped(prop, value) {
        console.log('>>> TOPIC SKIPPED:', prop, value);
    }

    deleted(prop) {
        console.log('>>> TOPIC DELETED:', prop);
    }
}