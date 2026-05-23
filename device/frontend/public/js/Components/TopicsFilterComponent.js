export default class TopicsFilterComponent {
    constructor(parent, options = {}) {
        this.topicsComponent = parent;
        this.page = this.topicsComponent.page;

        this.defaults = {
            search: ['turtle/'],    // array of strings
            exclude: [],            // array of strings
            direction: 'desc',      // asc, desc
            order: 'tsCreated',     // path, tsCreated, tsUpdated, count
            nested: '0',            // 0, 1
        };

        this.orderBy = ['path', 'tsCreated', 'tsUpdated', 'count'];

        this.loadStorage();

        if (!this.data)
            this.data = this.defaults;

        this.saveStorage();

    }

    loadStorage() {
        const data = localStorage.getItem('topics-filter');

        if (!data)
            return;

        this.data = JSON.parse(data);
    }

    saveStorage() {
        const data = JSON.stringify(this.data);
        localStorage.setItem('topics-filter', data);
    }

    render(targetElement) {
        this.element = document.createElement('div');
        this.element.className = 'topics-filter';
        targetElement.append(this.element);

        // searchGroup
        const searchGroup = document.createElement('div');
        searchGroup.className = 'filter-search';
        this.element.append(searchGroup);

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = _t('search');
        searchInput.value = this.data.search.join(' ');
        searchInput.oninput = () => this.apply({ search: searchInput.value });
        searchGroup.append(searchInput);

        const clearSearchButton = document.createElement('button');
        clearSearchButton.type = 'button';
        clearSearchButton.innerHTML = this.page.icons.svg.x;
        searchGroup.append(clearSearchButton);


        // exclude
        const excludeGroup = document.createElement('div');
        excludeGroup.className = 'filter-exclude';
        this.element.append(excludeGroup);

        const excludeInput = document.createElement('input');
        excludeInput.type = 'text';
        excludeInput.placeholder = _t('exclude');
        excludeInput.value = this.data.exclude.join(' ');
        excludeInput.oninput = () => this.apply({ exclude: excludeInput.value });
        excludeGroup.append(excludeInput);

        const clearExcludeButton = document.createElement('button');
        clearExcludeButton.type = 'button';
        clearExcludeButton.innerHTML = this.page.icons.svg.x;
        excludeGroup.append(clearExcludeButton);

        // nested
        /*
        const nestedGroup = document.createElement('div');
        nestedGroup.className = 'filter-nested';
        this.element.append(nestedGroup);

        const nestedLabel = document.createElement('span');
        nestedLabel.className = 'filter-label';
        nestedLabel.innerText = _t('Nested');
        nestedGroup.append(nestedLabel);

        const nestedInput = document.createElement('input');
        nestedInput.type = 'checkbox';
        nestedInput.checked = this.data.nested === '1';
        nestedInput.value = this.data.nested;
        nestedGroup.onchange = () => {
            nestedInput.checked ? nestedInput.value = '1' : nestedInput.value = '0';
            this.apply({ nested: nestedInput.value });
        };
        nestedGroup.append(nestedInput);
        */
        // direction
        const directionGroup = document.createElement('div');
        directionGroup.className = 'filter-direction';
        this.element.append(directionGroup);

        const directionLabel = document.createElement('span');
        directionLabel.className = 'filter-label';
        directionLabel.innerText = _t('Order');
        directionGroup.append(directionLabel);

        const directionInput = document.createElement('input');
        directionInput.type = 'checkbox';
        directionInput.checked = this.data.direction === 'asc';
        directionInput.value = this.data.direction;
        directionGroup.onchange = () => {
            directionInput.checked ? directionInput.value = 'asc' : directionInput.value = 'desc';
            this.apply({ direction: directionInput.value });
        };
        directionGroup.append(directionInput);

        // order
        const orderGroup = document.createElement('div');
        orderGroup.className = 'filter-order';
        this.element.append(orderGroup);

        const orderSelect = document.createElement('select');
        orderSelect.onchange = () => this.apply({ order: orderSelect.value });

        let optionElement = document.createElement('option');
        optionElement.innerText = _t('Please select');
        optionElement.value = '';
        orderSelect.append(optionElement);

        this.orderBy.forEach(by => {
            optionElement = document.createElement('option');
            optionElement.innerText = by;
            optionElement.value = by;
            orderSelect.append(optionElement);
        });
        orderSelect.value = this.data.order;
        orderGroup.append(orderSelect);

        this.element.append(orderGroup);
    }

    apply(data) {
        const nestedToggle = data.nested ? this.data.nested !== data.nested : false;

        const keys = Object.keys(data);
        keys.forEach(key => {
            if (key === 'search' || key === 'exclude') {
                data[key] === "" ?
                    this.data[key] = [] :
                    this.data[key] = `${data[key]}`.split(' ');

                if (this.data[key][this.data[key].length - 1] === '')
                    this.data[key].pop();
            }

            if (key !== 'search' && key !== 'exclude')
                this.data[key] = data[key];
        });
        this.saveStorage();

        // re-render the whole list
        if (nestedToggle === true) {
            this.topicsComponent.renderFull();
        }

        // do things here
        this.topicsComponent.applyFilter();

    }


}