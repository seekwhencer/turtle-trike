import LanguageService from "./Services/LanguageService.js"
import TopicsService from "./Services/TopicsService.js";

export default class Services {
    constructor(page, options = {}) {
        this.page = page;

        this.language = new LanguageService(this);
        this.topics = new TopicsService(this);
    };
}
