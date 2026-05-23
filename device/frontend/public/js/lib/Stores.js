import TopicsStore from "./Stores/TopicsStore.js";

export default class Stores {
    constructor(page) {
        this.page = page;

        this.topicsStore = new TopicsStore(this);
    }

    get topics() {
        return this.topicsStore.data;
    }

    set topics(val) {
        // do nothing
    }
}