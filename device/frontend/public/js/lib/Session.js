
//@TODO write it in localStorage

export default class Session {
    constructor(page) {
        this.page = page;

        this.defaults = {
            language: 'en'
        }
        //this.create();
    }

    async create() {
        await this.reset();
        
        // do things here ...
    }

    /**
     * reset the user session
     */
    async reset() {
        this.language = this.defaults.language;

        // set the default or the browser language
        await this.services.language.create();
    }

    get services() {
        return this.page.services;
    }

    set services(val) {
        //
    }
}