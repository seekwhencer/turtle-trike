export default class Topic {
    constructor(parent, path = null, value = null) {
        this.debug = false;

        this.topicStore = parent;
        this.page = this.topicStore.page;

        this.path = path;
        this.value = value;

    }

    created() {
        this.debug ? console.log('>>> TOPIC CREATED:', this.path, '<', this.value) : null;

        this.count = 1;
        this.tsCreated = Date.now();
        this.tsUpdated = Date.now();

        if (this.page.topicsComponent) {
            this.page.topicsComponent.add(this);
            this.page.topicsComponent.applyFilter();
        }
    }
    updated() {
        this.debug ? console.log('>>> TOPIC UPDATED:', this.path, '<', this.value) : null;

        this.count++;
        this.tsUpdated = Date.now();

        if(this.view)
            this.view.update();
        
        if(this.page.topicsComponent)
            this.page.topicsComponent.applyFilter();
    }

    get value() {
        return this._value;
    }

    set value(val) {
        //if (val === this.value)
        //    return;

        const existing = this.value !== undefined;
        const action = existing ? 'update' : 'create';

        this._value = val;

        if (action === 'create')
            this.created();

        if (action === 'update')
            this.updated();
    }
}