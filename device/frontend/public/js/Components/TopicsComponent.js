import TopicComponent from "./TopicComponent.js";
import TopicsFilterComponent from "./TopicsFilterComponent.js";

export default class TopicsComponent {
    constructor(parent, options = {}) {
        this.page = parent;
        this.options = options;
        this.debug = false;

        this.element = null;
        this.filter = null;
    }

    render(targetElement) {
        this.renderFilter(targetElement);

        this.element = document.createElement('div');
        this.element.className = 'topic-list';
        targetElement.append(this.element);
    }

    renderFilter(targetElement) {
        this.filter = new TopicsFilterComponent(this);
        this.filter.render(targetElement);
    }

    renderFull() {
        this.element.innerHTML = "";
        this.treeNodes.clear();
        this.renderFlatFull();
    }

    renderFlatFull() {
        for (const topic of Object.values(this.topics)) {
            this.addFlat(topic);
        }
    }


    // called from the store topic
    // topic is the store item
    add(topic) {
        this.addFlat(topic);
    }

    addFlat(topic) {
        const comp = new TopicComponent(topic);
        topic.view = comp;
        comp.render(this.element);
    }

    applyFilter() {
        this.debug ? console.log('>>> APPLY FILTER', this.filterData) : null;

        for (const path of Object.keys(this.topics)) {
            const topic = this.topics[path];
            let visible = false;

            // search
            if (this.filterData.search.length === 0) {
                visible = true;
            } else {
                visible = this.filterData.search.every(search => topic.path.includes(search));
            }

            // exclude
            if (this.filterData.exclude.length > 0) {
                if (this.filterData.exclude.some(exclude => topic.path.includes(exclude))) {
                    visible = false;
                }
            }
            topic.view ? visible ? topic.view.show() : topic.view.hide() : null;
        };
        this.applyOrder();
    }

    applyOrder() {
        this.applyFlatOrder();
    }

    applyFlatOrder() {
        const prop = this.filter.data.order;
        const direction = this.filter.data.direction === "asc" ? 1 : -1;

        const items = Object.values(this.topics);

        items.sort((a, b) => {
            const va = a[prop];
            const vb = b[prop];

            if (typeof va === "string") {
                return va.localeCompare(vb) * direction;
            }

            return (va - vb) * direction;
        });

        items.forEach((topic, index) => {
            if(topic?.view?.element)
                topic.view.element.style.order = index;
        });
    }

    get filterData() {
        return this.filter.data;
    }

    set filterData(val) {
        // do nothing
    }

    get topics() {
        return this.page.stores.topics;
    }

    set topics(val) {
        // do nothing
    }
}