import dateFormat from 'dateformat';
import App from './app.js';

const app = new App();
await app.start();

LOG('');
LOG('//////////////////');
LOG('RUNNING:', PACKAGE.name);
LOG('VERSION:', PACKAGE.version);
LOG('ENVIRONMENT:', ENVIRONMENT);
LOG('DATE TIME:', dateFormat(new Date(), "H:MM:ss - d.m.yyyy"));
LOG('/////////');
LOG('');