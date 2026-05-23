export default class TopicComponent {
    constructor(topicStore) {
        this.topicStore = topicStore;
    }

    render(targetElement) {
        this.element = document.createElement('div');
        this.element.className = 'topic added hidden';
        targetElement.prepend(this.element);

        setTimeout(() => this.element.classList.remove('added'), 10);

        this.renderRow();
    }

    renderRow() {
        this.row = document.createElement('div');
        this.row.className = 'topic-row';
        this.element.append(this.row);

        // render things
        const pathElement = document.createElement('div');
        pathElement.className = 'topic-path';
        pathElement.innerText = this.path;
        this.row.append(pathElement);

        const dataElement = document.createElement('div');
        dataElement.className = 'topic-data';
        this.row.append(dataElement);

        this.valueElement = document.createElement('div');
        this.valueElement.className = 'topic-value';
        this.valueElement.innerText = this.value;
        dataElement.append(this.valueElement);

        const timeElement = document.createElement('div');
        timeElement.className = 'topic-time';
        dataElement.append(timeElement);

        this.dateTimeCreatedElement = document.createElement('div');
        this.dateTimeCreatedElement.innerText = this.dateTimeCreated;
        timeElement.append(this.dateTimeCreatedElement);

        this.dateTimeUpdatedElement = document.createElement('div');
        this.dateTimeUpdatedElement.innerText = this.dateTimeCreated;
        timeElement.append(this.dateTimeUpdatedElement);


        this.countElement = document.createElement('div');
        this.countElement.className = 'topic-value';
        this.countElement.innerText = this.count;
        dataElement.append(this.countElement);
    }

    // triggered from the topic store item
    // 
    update() {
        this.element.classList.add('updated');
        setTimeout(() => this.element.classList.remove('updated'), 100);

        this.valueElement.innerText = this.value;
        this.dateTimeUpdatedElement.innerText = this.dateTimeUpdated;
        this.countElement.innerText = this.count;
    }

    show() {
        this.element.classList.remove('hidden');
    }

    hide() {
        this.element.classList.add('hidden');
    }

    get path() {
        return this.topicStore.path;
    }

    set path(val) {
        //
    }

    get value() {
        return this.topicStore.value;
    }

    set value(val) {
        //
    }

    get count() {
        return this.topicStore.count;
    }

    set count(val) {
        //
    }

    get dateTimeUpdated() {
        return new Date(this.topicStore.tsUpdated).toLocaleTimeString() + " " + new Date(this.topicStore.tsUpdated).toLocaleDateString();
    }

    set dateTimeUpdated(val) {
        //
    }

    get dateTimeCreated() {
        return new Date(this.topicStore.tsCreated).toLocaleTimeString() + " " + new Date(this.topicStore.tsCreated).toLocaleDateString();
    }

    set dateTimeCreated(val) {
        //
    }
}