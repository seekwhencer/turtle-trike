import Route from '../Route.js';

export default class extends Route {
    constructor(parent, options) {
        super(parent, options);

        // home
        this.router.get('/', (req, res) => {
            res.json({
                home: "test"
            });
        });

        // restart the core with all dependencies
        this.router.get('/restart', (req, res) => {
            res.end('restarting...');
            global.APP.restart();
        });

        // the topics definitions
        this.router.get('/topics', (req, res) => {
            res.json(global.APP.getTopics());
        });

        // force json download definitions
        this.router.get('/topics.json', (req, res) => {
            res.set("Content-Disposition", "inline;filename=topics.json");
            res.set("Content-Type", "application/octet-stream");
            res.end(JSON.stringify(global.APP.getTopics(), null, 2));
        });

        // reload all topics
        this.router.get('/topics/reload', (req, res) => {
            global.APP.reloadTopics().then(() => res.end('topics reloaded...'));
        });

        return this.router;
    }
}
