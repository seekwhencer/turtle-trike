import Hostapd from "./Hostapd.js";
import Dnsmasq from "./Dnsmasq.js";

export default class Accesspoint {
    constructor(app) {
        this.app = app;

        this.label = 'ACCESSPOINT'
        this.debug = SERVER_ACCESSPOINT_DEBUG || true;

        LOG(this.label, 'INIT | DEBUG', this.debug);

        
    }

    async create() {      
        //this.hostapd = new Hostapd(this);
        //await this.hostapd.create();

        this.dnsmasq = new Dnsmasq(this);
        await this.dnsmasq.create();
    }
}