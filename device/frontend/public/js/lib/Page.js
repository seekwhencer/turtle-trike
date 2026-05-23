import Toaster from "./Toaster.js";
import FetchManager from "./FetchManager.js";
import Icons from "./Icons.js";
import Websocket from "./Websocket.js";

import Stores from "./Stores.js";
import Services from "./Services.js";
import Session from "./Session.js";

import TopicsComponent from "../Components/TopicsComponent.js";
import VideoComponent from "../Components/VideoComponent.js";

export default class Page {
    constructor() {
        this.label = this.constructor.name.toUpperCase();
        // 
        this.toaster = new Toaster({
            duration: 5000,
            maxWidth: 300,
            position: 'top-right',
        });

        // Fetch Manager
        this.fm = new FetchManager();

        // Stores
        this.stores = new Stores(this);

        // Ícons
        this.icons = new Icons(this);

        // Services
        this.services = new Services(this);

        // User Session
        this.session = new Session(this);

        // Websocket
        this.ws = new Websocket(this);
    }

    async create() {
        try {
            await this.icons.load();
            await this.services.language.create();
            await this.session.create();
            await this.render();
            this.ws.connect();
        } catch (err) {
            throw new Error(err);
        }
    }

    async render() {
        const el = document.createElement('div');
        el.className = 'page';
        this.element = el;
        document.querySelector('body').append(this.element);

        this.videoComponent = new VideoComponent(this);
        this.videoComponent.render(this.element);

        this.topicsComponent = new TopicsComponent(this);
        this.topicsComponent.render(this.element);
    }

    // received websocket message 
    message(data) {
        this.services.topics.message(data);
    }

}