export default class Store {
    constructor(stores, options = {}) {
        this.stores = stores;
        this.options = options;

    }


    // CRUD callbacks

    created(prop, value) {
        console.log('>>> TOPIC CREATED:', prop, value);
    }

    updated(prop, value) {
        console.log('>>> TOPIC UPDATED:', prop, value);
    }

    skipped(prop, value) {
        console.log('>>> TOPIC SKIPPED:', prop, value);
    }

    deleted(prop) {
        console.log('>>> TOPIC DELETED:', prop);
    }

    get page() {
        return this.stores.page;
    }

    set page(val) {
        // do nothing
    }
}