import Service from "./Service.js";
export default class LanguageService extends Service {
    constructor(parent, options = {}) {
        super(parent, options);
        this.label = this.constructor.name.toUpperCase();

        this.availableLanguagesUrl = options?.availableLanguagesUrl || '/config/languages.json';
        this.translationsUrl = options?.translationsUrl || '/config/translations';
        this.translations = {};

        window._t = key => this.translate(key);
    }

    async create() {
        // once per lifetime
        await this.getAvailableLanguages();
        this.defaultLanguage = this.getDefault();

        // set the session 
        await this.setLanguage(this.defaultLanguage.lang);
    }

    async getAvailableLanguages() {
        if (this.availableLanguages)
            return;

        const res = await this.fm.fetch(this.availableLanguagesUrl, {
            method: 'GET',
            credentials: 'include'
        });
        const text = await res.text();
        const data = await JSON.parse(text);

        if (data)
            if (data.error)
                return false;

        this.availableLanguages = data;
    }

    async getTranslation(lang) {
        await this.getAvailableLanguages();

        if (this.translations[lang])
            return true;

        const url = `${this.translationsUrl}/${lang}.json`;
        const res = await this.fm.fetch(url, {
            method: 'GET',
            credentials: 'include'
        });
        const text = await res.text();
        const data = await JSON.parse(text);

        if (data) {
            if (data.error)
                return false;

            this.translations[lang] = data;
            return true;
        }

        return false;
    }

    getDefault() {
        let lang = this.getBrowser();
        if (!this.exists(lang))
            lang = Object.keys(this.availableLanguages).find(lang => this.availableLanguages[lang].default === true);

        return { lang: lang, ...this.availableLanguages[lang] };
    }

    getBrowser() {
        return (navigator.languages?.[0] || navigator.language).split("-")[0];
    }

    exists(lang) {
        return this.availableLanguages[lang] ? true : false;
    }

    async setLanguage(lang) {
        if (this.exists(lang)) {
            if (this.availableLanguages[lang].active !== true)
                return false;

            const ok = await this.services.language.getTranslation(lang);
            if (ok) {
                if (ok.error)
                    return false;
                
                // set it finally to the session
                this.session.language = lang;

                // set the document language
                const htmlElement = document.querySelector('html');
                htmlElement.lang = lang;

                // set rtl
                this.availableLanguages[lang].rtl === true ? 
                    htmlElement.dir = "rtl" :
                    htmlElement.removeAttribute('dir');

                return true;
            }
        }

        return false;
    }

    translate(key) {
        const text = this.translations[this.session.language][key];

        if (!text)
            return key;

        return text;
    }
}
