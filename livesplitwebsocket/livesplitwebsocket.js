const EventEmitter = require('events');
const listenTypes = ['pause', 'reset', 'resume', 'skipSplit', 'split', 'start', 'switchComparison', 'undoAllPauses', 'undoSplit'];
const requestTypes = ['getbestpossibletime', 'getcomparison', 'getcomparisonsplittime', 'getcurrentsplitname', 'getcurrenttime', 'getcurrenttimerphase', 'getGame', 'getlastsplittime', 'getprevioussplitname', 'getsplitindex', 'getsplits', 'getdelta', 'getfinaltime', 'getpredictedtime'];
const timeout = 1000;

/**
 * Websocket extension for LiveSplit connection
 * @constructor
 * @param {string} address - Connection address, like: 127.0.0.1
 * @param {string} port - Connection port, like: 16385
 */
class LiveSplitWebsocket extends EventEmitter {
    constructor(url) {
        super();

        if (!url || typeof url !== 'string') {
            throw new Error('Invalid argument type! string expected.');
        }

        this._connected = false;
        this._url = url;
        /**
         * According to: https://github.com/LiveSplit/LiveSplit.Server/blob/a4a57716dce90936606bfc8f8ac84f7623773aa5/README.md#commands
         *
         * When using Game Time, it's important that you call "initgametime" once. Once "initgametime" is used, an additional comparison will appear and you can switch to it via the context menu (Compare Against > Game Time). This special comparison will show everything based on the Game Time (every component now shows Game Time based information).
         */
        this._initGameTimeOnce = false;

        return this;
    }

    connect() {
        let res;
        const socket = this._socket = new WebSocket(this._url),
            promise = new Promise(r => res = r);

        const onOpen = () => {
            res();
            this._connected = true;
            this.emit('open');
            socket.removeEventListener('open', onOpen);
        };
        socket.addEventListener('open', onOpen);

        const onMessage = e => {
            const { name, data } = JSON.parse(e.data);
            console.log(name);
            console.log(data);
            this.emit(name, data);
        };
        socket.addEventListener('message', onMessage);

        const onError = e => this.emit('error', e.data ?? "Thrown error does not have data.  Likely, LiveSplit isn't running.");
        socket.addEventListener('error', onError);

        const onClose = () => {
            this._connected = false;
            this.emit('close');
            socket.removeEventListener('close', onClose);
            socket.removeEventListener('error', onError);
            socket.removeEventListener('message', onMessage);
        };
        socket.addEventListener('close', onClose);

        return promise;
    }

    getData(request) {
        if (requestTypes.includes(request)) {
            return this._waitForResponse(request);
        } else {
            return Promise.reject('Invalid Request Type');
        }
    }

    listenFor(listen) {
        if (listenTypes.includes(listen)) {
            const listenMsg = 'registerEvent ' + listen;
            this.send(listenMsg, false);
            return Promise.resolve('Began Listening for ' + listen);
        } else {
            return Promise.reject('Invalid Listen Type');
        }
    }

    _waitForResponse(str) {
        return Promise.withTimeout(() => this.send(str, true), timeout);
    }

    /**
     * Send command to the LiveSplit Server instance.
     * @param {string} command - Existing LiveSplit Server command without linebreaks.
     * @param {boolean?} [expectResponse=true] - Expect response from the server.
     * @returns {Promise}
     */
    send(command, expectResponse = true) {
        if (this._socket.readyState !== WebSocket.OPEN) {
            throw new Error('Client must be connected to the server to send messages!');
        }

        if (typeof command !== 'string') {
            throw new Error('String expected!');
        }

        this._socket.send(command);

        if (expectResponse) {
            return new Promise(res => this.once(command, res));
        }
    }
}

module.exports = LiveSplitWebsocket;