require('./promise-extensions');
const LiveSplitWebsocket = require('./livesplitwebsocket');

const livesplit = window.livesplit = new LiveSplitWebsocket(`ws://127.0.0.1:16835/livesplit`);
