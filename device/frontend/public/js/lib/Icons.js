
export default class Icons {
    constructor(page, options = {}) {
        this.page = page;
        this.fm = this.page.fm;

        this.basePath = options?.basePath || '/images/icons';
        this.tablePath = options?.tablePath || '/config';
        this.table = options?.table || false;
    }

    async load() {
        await this.loadTable();
        await this.loadSVGs();
    }

    async loadTable() {
        const url = `${this.tablePath}/icons.json`;

        try {
            const res = await this.fm.fetch(url);
            if (!res.ok) throw new Error(res.status);
            this.table = await res.json();
        } catch (err) {
            console.error('Fehler beim Laden von', url, err);
        }
    }

    async loadSVGs() {
        this.svg = {};

        for (const item of this.table) {
            let url = `${this.basePath}/${item.name}.svg`;

            if (item.path)
                url = `${item.path}/${item.name}.svg`;

            try {
                const res = await this.fm.fetch(url);
                if (!res.ok) throw new Error(res.status);

                const text = await res.text();
                this.svg[item.name] = text; // raw SVG-String
            } catch (err) {
                console.error('Fehler beim Laden von', url, err);
                this.svg[item.name] = null;
            }
        }
    }
}