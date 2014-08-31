/**
 * @class AccessClient
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/27/14
 */

var SpellCheckClient = function(options) {
    'use strict';

    var client = this,
        log = options.log,
        socketHost = options.socketHost,
        channelName = '/spellcheck',
        hub,
        appkey = options.appkey, // the spell checker's ssid
        checkCallback = options.checkCallback,
        cid = Math.random().toString(20);

    /**
     * open the public/private channels to begin exchanges
     */
    this.start = function() {
        client.createHub();

        log.info('open the access channel: ', channelName);

        hub.subscribe( channelName, client.spellCheckMessageHandler ).then(function() {
            log.info('channel ', channelName, ' alive...');
        });
    };

    /**
     * the public access channel message handler; grab the current token and queue
     * the outgoing private message
     *
     * @param msg - a wrapped message request
     */
    this.spellCheckMessageHandler = function(msg) {

        if (msg.ssid === appkey) {
            log.info( JSON.stringify( msg ));
        }
    };

    this.checkSpelling = function(word) {
        log.info('spell check the word: ', word);

        var request = {
            word:word,
            action:'check'
        };

        hub.publish( channelName, client.wrapMessage( cid, request ) );
    };

    this.createHub = function() {
        if (!hub) {
            hub = new Faye.Client( socketHost, { timeout:50 });
        }

        return hub;
    };

    /**
     * create the standard wrapper
     *
     * @param id the channel id
     * @param request a request object
     * @returns the wrapped message request
     */
    this.wrapMessage = function(id, request) {
        var message = {
            ssid:id,
            ts:Date.now(),
            message:request
        };

        return message;
    };

    // constructor validations
    if (!log) throw new Error('access client must be constructed with a log');
};

SpellCheckClient.createInstance = function(opts) {
    'use strict';

    if (!opts) opts = {};

    opts.version = '2014.08.30';

    opts.log = RemoteLogger.createLogger('SpellCheckClient');

    // simulate an ajax fetch...

    opts.host = 'http://localhost:29169';
    opts.hubName = '/MessageHub';
    opts.appkey = '71268c55-a8b3-4839-a1f5-34e3d6e70fdd';

    opts.socketHost = opts.host + opts.hubName;

    return new SpellCheckClient( opts );
};

if (typeof module === 'object') {
    module.exports = SpellCheckClient;
}