export default class Service {
    constructor(parent, options = {}) {
        this.parent = parent;
        this.options = options;
        
        this.page = this.parent.page;
        this.fm = this.page.fm;
    }

    get toaster() {
        return this.page.toaster;
    }

    set toaster(val) {
        //
    }

    get session() {
        return this.page.session;
    }

    set session(val) {
        //
    }

    get services() {
        return this.page.services;
    }

    set services(val) {
        //
    }

    get stores() {
        return this.page.stores;
    }

    set stores(val) {
        //
    }

    get scenes() {
        return this.page.scenes;
    }

    set scenes(val){
        //
    }
}