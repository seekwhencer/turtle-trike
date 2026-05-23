import "./VideoReader.js";

export default class VideoComponent {
    constructor(parent, options = {}) {
        this.page = parent;
        this.options = options;
        this.debug = false;

        this.element = null;
        this.url = `http://${window.location.host}:8889/live-sub/whep`;
        this.reader = null;

        window.addEventListener('beforeunload', () => {
            if (this.reader !== null) {
                this.reader.close();
            }
        });
    }

    render(targetElement) {
        this.element = document.createElement('div');
        this.element.className = 'video';
        targetElement.append(this.element);

        this.renderVideo(this.element);
    }

    renderVideo(targetElement) {
        this.video = document.createElement('video');
        this.message = document.createElement('message');

        targetElement.append(this.video);
        targetElement.append(this.message);

        this.defaultControls = false;

        this.loadAttributesFromQuery();

        this.reader = new MediaMTXWebRTCReader({
            url: this.url,
            onError: (err) => {
                this.setMessage(err);
            },
            onTrack: (evt) => {
                this.setMessage('');
                this.video.srcObject = evt.streams[0];
            },
            onDataChannel: (evt) => {
                evt.channel.binaryType = 'arraybuffer';
                evt.channel.onmessage = (evt) => {
                    console.log('data channel message', evt.data);
                };
            },
        });
    }


    parseBoolString(str, defaultVal) {
        str = (str || '');

        if (['1', 'yes', 'true'].includes(str.toLowerCase())) {
            return true;
        }
        if (['0', 'no', 'false'].includes(str.toLowerCase())) {
            return false;
        }
        return defaultVal;
    };


    setMessage(str) {
        if (str !== '') {
            this.video.controls = false;
        } else {
            this.video.controls = this.defaultControls;
        }
        this.message.innerText = str;
    };

    loadAttributesFromQuery() {
        const params = new URLSearchParams(window.location.search);
        this.video.controls = this.parseBoolString(params.get('controls'), true);
        this.video.muted = this.parseBoolString(params.get('muted'), true);
        this.video.autoplay = this.parseBoolString(params.get('autoplay'), true);
        this.video.playsInline = this.parseBoolString(params.get('playsinline'), true);
        this.video.disablepictureinpicture = this.parseBoolString(params.get('disablepictureinpicture'), false);
        this.defaultControls = this.video.controls;
    };



}